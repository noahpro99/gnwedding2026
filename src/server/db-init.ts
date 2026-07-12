import { db } from "./db";

const invites = [
  {
    "id": "steven-swannell",
    "guest_names": "Steven Swannell, Brunilda Swannell & Sophie Swannell",
    "party_size_max": 3
  },
  {
    "id": "dan-provenzano",
    "guest_names": "Dan Provenzano, Traci Provenzano, Delia Provenzano & Seth Provenzano",
    "party_size_max": 4
  },
  {
    "id": "elijah-colliver",
    "guest_names": "Elijah Colliver & Lily Braun",
    "party_size_max": 2
  },
  {
    "id": "ethan-colliver",
    "guest_names": "Ethan Colliver, Lauren Colliver, Gideon Colliver, Jonah Colliver, Sarahfina Colliver & Guest",
    "party_size_max": 6
  },
  {
    "id": "scott-chapman",
    "guest_names": "Scott Chapman, Meghann Chapman, Cora Chapman, Marianne Chapman, Luther Chapman, Lori Chapman, Olivia Chapman, Daniel Chapman, Oliver Chapman & Guest",
    "party_size_max": 10
  },
  {
    "id": "lyn-currie",
    "guest_names": "Lyn Currie",
    "party_size_max": 1
  },
  {
    "id": "charles-swannell",
    "guest_names": "Charles Swannell",
    "party_size_max": 1
  },
  {
    "id": "nancy-swannell",
    "guest_names": "Nancy Swannell",
    "party_size_max": 1
  },
  {
    "id": "mark-rizzi",
    "guest_names": "Mark Rizzi, Rachel Rizzi, Jocelyn Rizzi & Meredith Rizzi",
    "party_size_max": 4
  },
  {
    "id": "paul-vidal",
    "guest_names": "Paul Vidal, Sarah Vidal, Natalie Vidal & Noelle Vidal",
    "party_size_max": 4
  },
  {
    "id": "don-simon",
    "guest_names": "Don Simon, Vicki Simon, Julia Simon, Audrey Simon & Thomas Simon",
    "party_size_max": 5
  },
  {
    "id": "chris-kreeger",
    "guest_names": "Chris Kreeger",
    "party_size_max": 1
  },
  {
    "id": "karen-kreeger",
    "guest_names": "Karen Kreeger",
    "party_size_max": 1
  },
  {
    "id": "shirin-mohammedian",
    "guest_names": "Shirin Mohammedian & Guest",
    "party_size_max": 2
  },
  {
    "id": "joe-provenzano",
    "guest_names": "Joe Provenzano & Linda Provenzano",
    "party_size_max": 2
  },
  {
    "id": "gary-provenzano",
    "guest_names": "Gary Provenzano, Pam Provenzano & Scott Provenzano",
    "party_size_max": 3
  },
  {
    "id": "nathan-kuypers",
    "guest_names": "Nathan Kuypers, Anilse Kuypers, Riley Kuypers, Brooke Kuypers, Lucas Kuypers & Ellie Kuypers",
    "party_size_max": 6
  },
  {
    "id": "joe-robles-jr",
    "guest_names": "Joe Robles Jr., Emily Robles & Reina Robles",
    "party_size_max": 3
  },
  {
    "id": "paul-lipchak",
    "guest_names": "Paul Lipchak & Megan Andrews",
    "party_size_max": 2
  },
  {
    "id": "trisha-sando",
    "guest_names": "Trisha Sando",
    "party_size_max": 1
  },
  {
    "id": "ingrid-dema",
    "guest_names": "Ingrid Dema, Flora Dema & David Dema",
    "party_size_max": 3
  },
  {
    "id": "rei-dema",
    "guest_names": "Rei Dema & Guest",
    "party_size_max": 2
  },
  {
    "id": "boaz-salik",
    "guest_names": "Boaz Salik, Erin Salik, Rivka Salik & Miriam Salik",
    "party_size_max": 4
  },
  {
    "id": "will-smith",
    "guest_names": "Will Smith, Caitlyn Smith, Lucy Smith & Maisy Smith",
    "party_size_max": 4
  },
  {
    "id": "jenna-o-riordan",
    "guest_names": "Jenna O’Riordan & Guest",
    "party_size_max": 2
  },
  {
    "id": "heather-leaper",
    "guest_names": "Heather Leaper & Guest",
    "party_size_max": 2
  },
  {
    "id": "katherine-okie",
    "guest_names": "Katherine Okie",
    "party_size_max": 1
  },
  {
    "id": "sally-hamouda",
    "guest_names": "Sally Hamouda & Guest",
    "party_size_max": 2
  },
  {
    "id": "tu-vu",
    "guest_names": "Tu Vu & 3 Guests",
    "party_size_max": 4
  },
  {
    "id": "zachary-brown",
    "guest_names": "Zachary Brown, Jennifer Brown, Collin Brown, Kaila Brown, Patrick Brown, Valeria Mercado & Guest",
    "party_size_max": 7
  },
  {
    "id": "aanish-pradhan",
    "guest_names": "Aanish Pradhan",
    "party_size_max": 1
  },
  {
    "id": "reid-broughton",
    "guest_names": "Reid Broughton",
    "party_size_max": 1
  },
  {
    "id": "mikhail-sannikov",
    "guest_names": "Mikhail Sannikov & Guest",
    "party_size_max": 2
  },
  {
    "id": "rituraj-sharma",
    "guest_names": "Rituraj Sharma",
    "party_size_max": 1
  },
  {
    "id": "michael-randolph",
    "guest_names": "Michael Randolph",
    "party_size_max": 1
  },
  {
    "id": "jacob-mills",
    "guest_names": "Jacob Mills & Guest",
    "party_size_max": 2
  },
  {
    "id": "arthur-bond",
    "guest_names": "Arthur Bond",
    "party_size_max": 1
  },
  {
    "id": "noam-graf",
    "guest_names": "Noam Graf",
    "party_size_max": 1
  },
  {
    "id": "stuti-shah",
    "guest_names": "Stuti Shah & Guest",
    "party_size_max": 2
  },
  {
    "id": "jesse-braak",
    "guest_names": "Jesse Braak",
    "party_size_max": 1
  },
  {
    "id": "gabe-turbyfill",
    "guest_names": "Gabe Turbyfill",
    "party_size_max": 1
  },
  {
    "id": "patrick-stock",
    "guest_names": "Patrick Stock",
    "party_size_max": 1
  },
  {
    "id": "scott-helsing",
    "guest_names": "Scott Helsing, Lee Ann Helsing, Caleb Helsing, Serina Helsing, Ella Grace Helsing & 2 Guests",
    "party_size_max": 7
  },
  {
    "id": "robert-howe",
    "guest_names": "Robert Howe, Karen Howe, Alexander Howe, Elijah Howe, Ella Howe & Lucy Howe",
    "party_size_max": 6
  },
  {
    "id": "travis-white",
    "guest_names": "Travis White & Kandi White",
    "party_size_max": 2
  },
  {
    "id": "garrett-thompson",
    "guest_names": "Garrett Thompson & Kaelyn Thompson",
    "party_size_max": 2
  },
  {
    "id": "patrick-davis",
    "guest_names": "Patrick Davis",
    "party_size_max": 1
  },
  {
    "id": "dave-backus",
    "guest_names": "Dave Backus, Deborah Backus, Kendall Backus & Guest",
    "party_size_max": 4
  },
  {
    "id": "frank-hecox",
    "guest_names": "Frank Hecox & Susie Hecox",
    "party_size_max": 2
  },
  {
    "id": "jessica-lindsey",
    "guest_names": "Jessica Lindsey & Mason Sizemore",
    "party_size_max": 2
  },
  {
    "id": "tom-johnson",
    "guest_names": "Tom Johnson & Linda Johnson",
    "party_size_max": 2
  },
  {
    "id": "danny-mountjoy",
    "guest_names": "Danny Mountjoy & Anne Mountjoy",
    "party_size_max": 2
  },
  {
    "id": "shawna-buck",
    "guest_names": "Shawna Buck",
    "party_size_max": 1
  }
];

for (const invite of invites) {
  db.run(
    `INSERT OR IGNORE INTO invites (id, guest_names, party_size_max) VALUES (?, ?, ?)`,
    [invite.id, invite.guest_names, invite.party_size_max],
  );
}

console.log("Inserted", invites.length, "invites.");
