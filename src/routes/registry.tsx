import { createFileRoute } from "@tanstack/react-router";
import { Check, ExternalLink, Gift, MapPin, X } from "lucide-react";
import { useState } from "react";
import { SectionHeader } from "~/components/SectionHeader";
import { claimItem, listClaims, unclaimItem } from "~/server/registry";

export const Route = createFileRoute("/registry")({
  loader: async () => ({ claims: await listClaims() }),
  component: Registry,
});

type Item = { name: string; price?: number; url?: string };
type Section = { title: string; note?: string; items: Item[] };

const REGISTRY: Section[] = [
  {
    title: "Kitchen",
    items: [
      {
        name: "Cheese grater",
        price: 12,
        url: "https://www.amazon.com/Spring-Chef-Stainless-Parmesan-Vegetables/dp/B011B8M2GO",
      },
      {
        name: "Silicone spatula",
        url: "https://www.amazon.com/OXO-11280300-Medium-Silicone-Spatula-Jam/dp/B08HV272BN",
      },
      {
        name: "Mixing pyrex bowls",
        price: 18,
        url: "https://www.amazon.com/Pyrex-Prepping-Preheated-Dishwasher-Microwave/dp/B00LGLHUA0",
      },
      {
        name: "Oven mitts",
        price: 15,
        url: "https://www.amazon.com/KitchenAid-Kitchen-Beacon-Milkshake-Beige/dp/B09NZS88D6",
      },
      {
        name: "Tongs",
        price: 11,
        url: "https://www.amazon.com/KitchenAid-KO091OHSSA-Gourmet-10-63-Inch-Stainless/dp/B07Q5CJDM9",
      },
      {
        name: "Panini press",
        price: 35,
        url: "https://www.amazon.com/Chefman-Panini-Press-Non-Stick-Stainless/dp/B077YR9FFG",
      },
      {
        name: "Cooking pans",
        price: 45,
        url: "https://www.amazon.com/EWFEN-Stainless-Induction-Dishwasher-Detachable/dp/B0F9FB9448",
      },
      {
        name: "Cookie sheets",
        price: 23,
        url: "https://www.amazon.com/Commercial-Stainless-Resistant-Nonstick-18X13Inch/dp/B0DCVQPG8B",
      },
      {
        name: "Brownie pan",
        price: 13,
        url: "https://www.amazon.com/KitchenAid-Nonstick-Extended-Aluminized-Dishwasher/dp/B0CJP1G3PW",
      },
      {
        name: "Shower water filter",
        url: "https://www.amazon.com/Weddell-Duo-Shower-Filter-Microplastics/dp/B0CGLZLMNP",
      },
      {
        name: "Reverse osmosis water filter",
        price: 219,
        url: "https://www.amazon.com/iSpring-5-Stage-Prestige-Drinking-Certified/dp/B003XELTTG",
      },
      {
        name: "Metal colander",
        price: 13,
        url: "https://www.amazon.com/ExcelSteel-5-Quart-Stainless-Steel-Colander/dp/B00555ETXY",
      },
      { name: "Microwave" },
      { name: "Cutting board" },
    ],
  },
  {
    title: "Bath",
    items: [
      { name: "Bath towels" },
      { name: "Hand towels" },
      { name: "Stone bath mat" },
      { name: "Comforter (Gwen)" },
      {
        name: "Cotton sheet set",
        price: 37,
        url: "https://www.amazon.com/California-Design-Den-Natural-Pockets/dp/B09X1P1L9F",
      },
      { name: "Dish set" },
      { name: "Utensil set" },
      { name: "Knife set" },
      { name: "Glasses set" },
    ],
  },
  {
    title: "Household",
    items: [
      { name: "Air purifier" },
      { name: "Humidifier" },
      { name: "Vacuum" },
      { name: "Broom" },
      { name: "Mop" },
    ],
  },
];

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Registry() {
  const { claims: initialClaims } = Route.useLoaderData();
  const [claims, setClaims] = useState<Record<string, string>>(() =>
    Object.fromEntries(initialClaims.map((c) => [c.item_key, c.initials])),
  );

  const onClaim = (itemKey: string, initials: string) =>
    setClaims((prev) => ({ ...prev, [itemKey]: initials }));
  const onUnclaim = (itemKey: string) =>
    setClaims((prev) => {
      const next = { ...prev };
      delete next[itemKey];
      return next;
    });

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <SectionHeader
        eyebrow="If you'd like to gift"
        title="Registry"
        icon={Gift}
      >
        <p>
          If you are interested in contributing something from our wedding
          registry, consult the list of items below, or please run your gift
          idea by us before purchasing. Make sure to claim the item with your
          initials to avoid any confusion. We very much appreciate your
          generosity, thank you!
        </p>
      </SectionHeader>

      <ShippingAddress />

      <div className="mt-16 space-y-14">
        {REGISTRY.map((section) => (
          <div key={section.title}>
            <h2 className="font-script text-4xl text-burgundy text-center">
              {section.title}
            </h2>
            {section.note && (
              <p className="text-center text-sm text-ink/60 mt-2">
                {section.note}
              </p>
            )}
            <ul className="mt-6 space-y-2">
              {section.items.map((it) => {
                const key = `${slug(section.title)}--${slug(it.name)}`;
                return (
                  <RegistryRow
                    key={key}
                    itemKey={key}
                    name={it.name}
                    price={it.price}
                    url={it.url}
                    claimedBy={claims[key]}
                    onClaim={onClaim}
                    onUnclaim={onUnclaim}
                  />
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-16 text-center text-sm text-ink/60">
        Made a mistake? Click the initials on your claim to release it.
      </p>
    </section>
  );
}

function ShippingAddress() {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText("2100 Shadow Lake Rd").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <p className="text-sm text-ink/60 text-center">
        You can also send gifts directly to us.
      </p>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-2 px-5 py-2 border border-burgundy text-burgundy uppercase tracking-widest text-xs rounded-full hover:bg-burgundy hover:text-cream transition-colors"
      >
        <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />
        {copied ? "Copied!" : "Copy shipping address"}
      </button>
    </div>
  );
}

function RegistryRow({
  itemKey,
  name,
  price,
  url,
  claimedBy,
  onClaim,
  onUnclaim,
}: {
  itemKey: string;
  name: string;
  price?: number;
  url?: string;
  claimedBy?: string;
  onClaim: (key: string, initials: string) => void;
  onUnclaim: (key: string) => void;
}) {
  const [mode, setMode] = useState<"idle" | "claiming" | "releasing">("idle");
  const [initials, setInitials] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isClaimed = !!claimedBy;

  async function submitClaim(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await claimItem({ data: { itemKey, initials } });
      onClaim(itemKey, res.initials);
      setMode("idle");
      setInitials("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not claim");
    } finally {
      setBusy(false);
    }
  }

  async function submitRelease(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await unclaimItem({ data: { itemKey, initials } });
      onUnclaim(itemKey);
      setMode("idle");
      setInitials("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not release");
    } finally {
      setBusy(false);
    }
  }

  return (
    <li
      className={`relative px-4 py-3 rounded-xl border transition-colors ${
        isClaimed
          ? "bg-amber/20 border-amber/60"
          : "bg-parchment border-amber hover:border-burgundy"
      }`}
    >
      {url && mode === "idle" && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${name} in a new tab`}
          className="absolute inset-0 rounded-xl"
        />
      )}
      <div className="relative flex items-center gap-3 pointer-events-none">
        <span
          className={`flex-1 inline-flex items-center gap-1.5 ${
            isClaimed ? "line-through text-ink/50" : "text-ink/85"
          }`}
        >
          {name}
          {url && (
            <ExternalLink
              className="w-3.5 h-3.5 text-gold shrink-0"
              strokeWidth={1.75}
            />
          )}
        </span>
        {price && (
          <span className="text-ink/60 font-mono text-sm">${price}</span>
        )}

        {isClaimed ? (
          mode === "releasing" ? null : (
            <button
              type="button"
              onClick={() => {
                setMode("releasing");
                setError(null);
              }}
              className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-widest rounded-full bg-burgundy text-cream hover:bg-pumpkin transition-colors"
              title="Release this claim with the same initials"
            >
              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>Claimed · {claimedBy}</span>
            </button>
          )
        ) : mode === "claiming" ? null : (
          <button
            type="button"
            onClick={() => {
              setMode("claiming");
              setError(null);
            }}
            className="pointer-events-auto px-3 py-1 text-xs uppercase tracking-widest rounded-full border border-burgundy text-burgundy hover:bg-burgundy hover:text-cream transition-colors"
          >
            Claim
          </button>
        )}
      </div>

      {mode === "claiming" && (
        <form
          onSubmit={submitClaim}
          className="mt-3 flex flex-wrap items-center gap-2"
        >
          <label className="text-xs uppercase tracking-widest text-ink/60">
            Your initials
          </label>
          <input
            value={initials}
            onChange={(e) =>
              setInitials(
                e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z]/g, "")
                  .slice(0, 6),
              )
            }
            placeholder="e.g. AB"
            maxLength={6}
            required
            autoFocus
            className="w-24 bg-cream border border-amber focus:border-burgundy rounded-md outline-none px-2 py-1 text-ink font-mono"
          />
          <button
            type="submit"
            disabled={busy || !initials}
            className="px-3 py-1 text-xs uppercase tracking-widest rounded-full bg-burgundy text-cream hover:bg-pumpkin disabled:opacity-50 transition-colors"
          >
            {busy ? "…" : "Confirm"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("idle");
              setInitials("");
              setError(null);
            }}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs uppercase tracking-widest text-ink/60 hover:text-burgundy"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Cancel</span>
          </button>
          {error && <p className="text-xs text-oxblood w-full">{error}</p>}
        </form>
      )}

      {mode === "releasing" && (
        <form
          onSubmit={submitRelease}
          className="mt-3 flex flex-wrap items-center gap-2"
        >
          <label className="text-xs uppercase tracking-widest text-ink/60">
            Confirm initials to release
          </label>
          <input
            value={initials}
            onChange={(e) =>
              setInitials(
                e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z]/g, "")
                  .slice(0, 6),
              )
            }
            placeholder={claimedBy}
            maxLength={6}
            required
            autoFocus
            className="w-24 bg-cream border border-amber focus:border-burgundy rounded-md outline-none px-2 py-1 text-ink font-mono"
          />
          <button
            type="submit"
            disabled={busy || !initials}
            className="px-3 py-1 text-xs uppercase tracking-widest rounded-full bg-oxblood text-cream hover:bg-burgundy disabled:opacity-50 transition-colors"
          >
            {busy ? "…" : "Release"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("idle");
              setInitials("");
              setError(null);
            }}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs uppercase tracking-widest text-ink/60 hover:text-burgundy"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Cancel</span>
          </button>
          {error && <p className="text-xs text-oxblood w-full">{error}</p>}
        </form>
      )}
    </li>
  );
}
