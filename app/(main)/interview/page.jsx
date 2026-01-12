import { getAssessments } from "@/actions/interview";
import { redirect } from "next/navigation";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";

export default async function InterviewPrepPage() {
  let assessments = [];

  try {
    assessments = await getAssessments();
  } catch (error) {
    if (error.message.includes("User profile not found")) {
      // Redirect to onboarding if user hasn't completed it yet
      redirect("/onboarding");
    }
    // Re-throw other errors
    throw error;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>
      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}
