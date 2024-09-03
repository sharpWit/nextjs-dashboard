"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "./prisma";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  const { customerId, amount, status } = CreateInvoice.parse(rawFormData);
  const amountInCent = amount * 100;
  const date = new Date();
  const insert = await prisma.invoice.create({
    data: { customerId, amount: amountInCent, status, date },
  });

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");

  return insert;
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  const { customerId, amount, status } = UpdateInvoice.parse(rawFormData);

  const amountInCents = amount * 100;

  const date = new Date();
  const insert = await prisma.invoice.create({
    data: { customerId, amount: amountInCents, status, date },
  });

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");

  return insert;
}

export async function deleteInvoice(id: string) {
  const invoice = await prisma.invoice.delete({
    where: { id: Number(id) },
  });
  revalidatePath("/dashboard/invoices");
  return invoice;
}
