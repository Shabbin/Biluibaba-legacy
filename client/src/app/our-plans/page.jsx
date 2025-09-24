const packages = [
  {
    name: "Silver",
    price: 5000,
    features: [
      "10% discount on vet consultations.",
      "Free delivery on product orders above BDT 1,000.",
      "Instant chat with vets for basic queries (limited to 3 sessions per month)",
      "Priority access to customer support.",
      "Monthly reminders for pet health check-ups and vaccinations.",
    ],
  },
  {
    name: "Gold",
    price: 10000,
    features: [
      "20% discount on vet consultations.",
      "Free delivery on all product orders.",
      "Unlimited instant chat with vets for queries and advice",
      "1 free vaccination per year for your pet",
      "Early access to exclusive offers and new product launches.",
      "Personalized pet care advice (via email or chat).",
      "1 free online vet consultation per year.",
    ],
  },
  {
    name: "Platinum",
    price: 20000,
    features: [
      "25% discount on vet consultations.",
      "Free delivery on all product orders with no minimum amount.",
      "Unlimited instant chat with vets for queries and advice.",
      "2 free vaccinations per year for your pet.",
      "1 free neuter/spay service per year.",
      "Monthly personalized pet care tips and diet plans.",
      "2 free online vet consultations per year.",
      "Exclusive invites to pet-friendly events and workshops organized by Biluibaba.",
    ],
  },
];

export default function Page() {
  return (
    <div className="py-10 px-5">
      <h1 className="text-4xl font-bold text-center">
        Subscribe to get<br></br> our PREMIUM features!
      </h1>
      <div className="flex flex-row justify-between gap-5 py-10">
        {packages.map((p) => (
          <div className="basis-1/3 rounded-xl" key={p.name}>
            <div className="py-20 bg-[url('/subscription.png')] bg-no-repeat bg-cover bg-center rounded-tr-xl rounded-tl-xl text-white flex flex-col items-center justify-center gap-2">
              <div className="text-2xl">{p.name}</div>
              <div className="text-4xl font-bold">&#2547;{p.price}</div>
            </div>

            {p.features.map((f) => (
              <div className="border py-5 p-5" key={f}>
                {f}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
