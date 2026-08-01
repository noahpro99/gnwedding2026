import { BachelorForm } from "~/components/BachelorForm";
import { BowTie, PlayingCards, PokerChips, WhiskeyGlass } from "~/components/BachelorGraphics";

/** The dates/availability screen. Reused by the /bachelor route and by the
 *  invite card's "card flies away, form fades in" reveal. */
export function BachelorFormScreen({
  inviteId,
  name,
}: {
  inviteId?: string;
  name?: string;
}) {
  return (
    <div className="min-h-[100svh] bg-onyx text-ivory">
      <div className="mx-auto max-w-xl px-5 py-14 md:py-16">
        <div className="text-center">
          <BowTie className="mx-auto w-16 text-ivory" />
          <h1 className="mt-5 text-3xl md:text-4xl uppercase tracking-[0.16em] text-ivory">
            Noah's Bachelor Party
          </h1>
        </div>

        <div className="mt-9 flex items-end justify-center gap-9 text-silver">
          <WhiskeyGlass className="w-8" />
          <PokerChips className="w-11" />
          <PlayingCards className="w-11" />
        </div>

        <p className="mt-7 text-center text-sm text-silver/80 leading-relaxed">
          Thinking Ocean City. Van from Blacksburg, split the cost. Poker, whiskey, billiards, etc.
        </p>

        <div className="mt-9">
          <BachelorForm inviteId={inviteId} name={name} />
        </div>
      </div>
    </div>
  );
}
