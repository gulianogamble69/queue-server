import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";

initializeApp();
const db = getFirestore();

/**
 * Sends an almost-your-turn notification when the queue advances and a
 * waiting ticket moves within two positions of the counter.
 */
export const notifyAlmostYourTurn = onDocumentUpdated(
  "queues/{queueId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return;

    const previousNumber = Number(before.currentNumber ?? 0);
    const currentNumber = Number(after.currentNumber ?? 0);
    if (currentNumber <= previousNumber) return;

    const tickets = await db
      .collection("tickets")
      .where("queueId", "==", event.params.queueId)
      .where("status", "==", "waiting")
      .where("number", ">", currentNumber)
      .where("number", "<=", currentNumber + 2)
      .get();

    await Promise.all(
      tickets.docs.map(async (ticket) => {
        const data = ticket.data();
        const user = await db.collection("users").doc(data.userId).get();
        const tokens = (user.data()?.notificationTokens ?? []) as string[];
        if (tokens.length === 0) return;
        await getMessaging().sendEachForMulticast({
          tokens,
          notification: {
            title: "You are almost up",
            body: `Ticket #${data.number} is almost ready at ${data.queueName}.`,
          },
          data: {
            queueId: event.params.queueId,
            ticketId: ticket.id,
          },
        });
      }),
    );
  },
);