import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import dayjs from "dayjs";
import { getMailClient } from "../lib/mail";
import nodemailer from "nodemailer";

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips",
    {
      schema: {
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.string().email(),
        }),
      },
    },
    async (req) => {
      const { destination, starts_at, ends_at, owner_name, owner_email } =
        req.body;

      if (dayjs(starts_at).isBefore(new Date())) {
        throw new Error("Invalid trip start date");
      }

      if (dayjs(ends_at).isBefore(starts_at)) {
        throw new Error("Invalid trip end date");
      }

      const trip = await prisma.trip.create({
        data: {
          destination,
          starts_at,
          ends_at,
        },
      });

      const mail = await getMailClient();

      const message = await mail.sendMail({
        from: {
          name: "Equipe plann.er",
          address: "suporte@planner.com",
        },
        to: {
          name: owner_name,
          address: owner_email,
        },
        subject: "Testando email",
        html: `<p>Teste do envio do email</p>`,
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return { tripID: trip.id };
    }
  );
}
