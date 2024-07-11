import fastify from "fastify";
import cors from "@fastify/cors";
import { createTrip } from "./routes/create-trip";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";
import { confirmParticipants } from "./routes/confirm-participant";
import { getParticipants } from "./routes/get-participants";
import { createActivity } from "./routes/create-activity";
import { getActivities } from "./routes/get-activities";
import { CreateLink } from "./routes/create-link";
import { getLinks } from "./routes/get-links";
import { CreateInvite } from "./routes/create-invite";
import { UpdateTrip } from "./routes/update-trip";
import { GetTripDetails } from "./routes/get-trip-details";
import { getParticipant } from "./routes/get-participant";
import { errorHandler } from "./error-handler";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

app.register(createTrip);
app.register(confirmTrip);
app.register(UpdateTrip);
app.register(GetTripDetails);

app.register(confirmParticipants);
app.register(getParticipants);
app.register(getParticipant);
app.register(CreateInvite);

app.register(createActivity);
app.register(getActivities);

app.register(CreateLink);
app.register(getLinks);

app.listen({ port: 3333 }).then(() => {
  console.log("Server running...");
});
