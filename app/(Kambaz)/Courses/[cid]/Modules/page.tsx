import ModulesList from "./ModulesList";

export default async function Modules({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  return <ModulesList cid={cid} />;
}
