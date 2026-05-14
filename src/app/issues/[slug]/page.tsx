import { notFound } from "next/navigation";
import { allIssueSlugs, getIssueBySlug } from "@/data/issues";
import { IssueDetail } from "@/components/IssueDetail";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return allIssueSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<{ title: string; description: string }> {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);
  if (!issue) return { title: "Not found — DC Elections Tracker", description: "" };
  return {
    title: `${issue.title} — DC Elections Tracker`,
    description: issue.oneLiner,
  };
}

export default async function IssuePage({ params }: { params: Promise<Params> }): Promise<JSX.Element> {
  const { slug } = await params;
  const issue = getIssueBySlug(slug);
  if (!issue) notFound();
  return <IssueDetail issue={issue} />;
}
