import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import { NewsletterSubscriber } from "@/models";
import * as XLSX from "xlsx";
import Papa from "papaparse";

interface ImportRow {
  email?: string;
  Email?: string;
  EMAIL?: string;
  mail?: string;
  firstName?: string;
  FirstName?: string;
  first_name?: string;
  prenom?: string;
  Prenom?: string;
  lastName?: string;
  LastName?: string;
  last_name?: string;
  nom?: string;
  Nom?: string;
}

function normalizeRow(row: ImportRow): { email: string; firstName?: string; lastName?: string } | null {
  const email = (row.email || row.Email || row.EMAIL || row.mail || "").toString().toLowerCase().trim();

  if (!email || !email.includes("@")) {
    return null;
  }

  const firstName = row.firstName || row.FirstName || row.first_name || row.prenom || row.Prenom || "";
  const lastName = row.lastName || row.LastName || row.last_name || row.nom || row.Nom || "";

  return {
    email,
    firstName: firstName.toString().trim() || undefined,
    lastName: lastName.toString().trim() || undefined
  };
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let rows: ImportRow[] = [];

    if (fileName.endsWith(".csv")) {
      const text = buffer.toString("utf-8");
      const parsed = Papa.parse<ImportRow>(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim()
      });
      rows = parsed.data;
    }
    else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      rows = XLSX.utils.sheet_to_json<ImportRow>(sheet);
    }
    else {
      return NextResponse.json(
        { error: "Format de fichier non supporte. Utilisez CSV ou XLSX." },
        { status: 400 }
      );
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Le fichier est vide ou mal formate" },
        { status: 400 }
      );
    }

    const results = {
      total: rows.length,
      imported: 0,
      duplicates: 0,
      invalid: 0,
      errors: [] as string[]
    };

    for (const row of rows) {
      const normalized = normalizeRow(row);

      if (!normalized) {
        results.invalid++;
        continue;
      }

      try {
        const existing = await NewsletterSubscriber.findOne({ email: normalized.email });

        if (existing) {
          results.duplicates++;
          continue;
        }

        const unsubscribeToken = crypto.randomBytes(32).toString("hex");

        const subscriber = new NewsletterSubscriber({
          email: normalized.email,
          firstName: normalized.firstName,
          lastName: normalized.lastName,
          unsubscribeToken,
          source: "import",
          status: "active",
          tags: ["import"]
        });

        await subscriber.save();
        results.imported++;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erreur inconnue";
        results.errors.push("Erreur pour " + normalized.email + ": " + errorMsg);
      }
    }

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l import" },
      { status: 500 }
    );
  }
}
