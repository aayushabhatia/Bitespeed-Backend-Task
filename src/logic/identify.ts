import { PrismaClient } from '@prisma/client'; 
const prisma = new PrismaClient();

export const identifyUser = async ({ email, phoneNumber }: { email?: string; phoneNumber?: string }) => {
  if (!email && !phoneNumber) {
    throw new Error('At least one of email or phoneNumber must be provided');
  }

  // Find contacts matching email or phoneNumber
  if (!email && !phoneNumber) {
  throw new Error('At least one of email or phoneNumber must be provided');
}

const orFilters = [];
if (email) orFilters.push({ email });
if (phoneNumber) orFilters.push({ phoneNumber });

const contacts = await prisma.contact.findMany({
  where: {
    OR: orFilters,
  },
  orderBy: { createdAt: 'asc' }
});

  // If no contacts found, create new primary contact
  if (contacts.length === 0) {
    const newContact = await prisma.contact.create({
      data: { email, phoneNumber, linkPrecedence: 'primary' }
    });

    return {
      primaryContactId: newContact.id,
      emails: email ? [email] : [],
      phoneNumbers: phoneNumber ? [phoneNumber] : [],
      secondaryContactIds: []
    };
  }

  // Find primary contact or fallback to first
  let primary = contacts.find(c => c.linkPrecedence === 'primary') || contacts[0];

  // Check if exact contact exists (both email and phoneNumber)
  const exactContactExists = contacts.some(c => c.email === email && c.phoneNumber === phoneNumber);

  if (!exactContactExists) {
    await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primary.id,
        linkPrecedence: 'secondary'
      }
    });
  }

  // Get all related contacts (primary + secondaries)
  const all = await prisma.contact.findMany({
    where: {
      OR: [
        { id: primary.id },
        { linkedId: primary.id }
      ]
    },
    orderBy: { createdAt: 'asc' }
  });

  const emails = [...new Set(all.map(c => c.email).filter(Boolean))];
  const phoneNumbers = [...new Set(all.map(c => c.phoneNumber).filter(Boolean))];
  const secondaryContactIds = all.filter(c => c.linkPrecedence === 'secondary').map(c => c.id);

  return {
    primaryContactId: primary.id,
    emails,
    phoneNumbers,
    secondaryContactIds
  };
};
