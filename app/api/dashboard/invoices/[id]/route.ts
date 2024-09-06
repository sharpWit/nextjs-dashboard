import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function PATCH(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  const invoiceId = parseInt(id, 10);

  try {
    const formData = await req.json();
    const { customerId, amount, status } = formData;

    // Check if customerId is missing
    if (!customerId) {
      return NextResponse.json(
        { message: "Customer ID is required." },
        { status: 400 }
      );
    }

    // If status is missing, return an error
    if (!status) {
      return NextResponse.json(
        { message: "Status is required." },
        { status: 400 }
      );
    }

    // Convert amount to a number
    const amountNumber = parseFloat(amount?.toString() || "0");

    // If validation passes, proceed with database insertion
    const amountInCents = Math.round(amountNumber * 100); // Convert amount to cents
    const date = new Date();
    // Update the invoice
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { customerId, amount: amountInCents, status, date },
    });
    // Return success response
    return NextResponse.json(
      { message: "Invoice Edited Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error: ", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
