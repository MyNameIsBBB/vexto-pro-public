import { redirect } from "next/navigation";

export default function BuilderRedirectPage() {
    // Temporary redirect for legacy links; consolidated to /edit
    redirect("/edit");
}
