import { notFound } from "next/navigation";
import { allIssueSlugs, getIssueBySlug } from "@/data/issues";
import { IssueDetail } from "@/components/IssueDetail";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return allIssueSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: Params }): { title: string; description: string } {
  const issue = getIssueBySlug(params.slug);
  if (!issue) return { title: "Not found — DC Elections Tracker", description: "" };
  return {
    title: `${issue.title} — DC Elections Tracker`,
    description: issue.oneLiner,
  };
}

export default function IssuePage({ params }: { params: Params }): JSX.Element {
  const issue = getIssueBySlug(params.slug);
  if (!issue) notFound();
  return <IssueDetail issue={issue} />;
}
