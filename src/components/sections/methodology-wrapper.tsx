import { MethodologySection } from "@/components/sections/methodology-section";
import { getMethodologySteps } from "@/actions/cms-actions";

export async function MethodologySectionWrapper() {
    const steps = await getMethodologySteps();
    return <MethodologySection steps={steps} />;
}
