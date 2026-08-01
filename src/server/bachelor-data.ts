// Shared date options for the bachelor party.
//
// The per-person invite links at /bachelor/<id> come from bachelor-invites.ts,
// which is auto-generated from the "Bachlor party" column of the guest CSV.
// To change who's invited: edit the CSV, then run:
//   bun src/server/bachelor-gen.ts

// Candidate dates for the bachelor party. Everything is within one month of
// the wedding (Sunday, October 25, 2026): the four weekends leading up to it,
// plus the night before. `id` is the stable key stored with each response.
export type DateOption = {
  id: string;
  label: string; // short label, e.g. "Oct 2 to 4"
  detail: string; // longer descriptor, e.g. "Weekend"
};

export const DATE_OPTIONS: DateOption[] = [
  { id: "sep-25-27", label: "Sep 25 to 27", detail: "Weekend in Ocean City" },
  { id: "oct-2-4", label: "Oct 2 to 4", detail: "Weekend in Ocean City" },
  { id: "oct-9-11", label: "Oct 9 to 11", detail: "Weekend in Ocean City" },
  { id: "oct-16-18-oc", label: "Oct 16 to 18", detail: "Weekend in Ocean City" },
  { id: "oct-16-18-bburg", label: "Oct 16 to 18", detail: "Weekend in Blacksburg" },
  { id: "oct-24", label: "Oct 24", detail: "Night before, in Blacksburg" },
];

