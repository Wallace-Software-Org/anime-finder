"use client";

import Header from "./components/Header";
import ProgressBar from "./components/ProgressBar";
import QuizScreen from "./components/QuizScreen";
import BottomNavigation from "./components/BottomNavigation";
import OptionPill from "./components/OptionPill";
import LandingScreen from "./components/LandingScreen";
import LoadingScreen from "./components/LoadingScreen";
import ResultsScreen from "./components/ResultsScreen";
import { useQuiz, TOTAL_STEPS } from "./hooks/useQuiz";
import {
  EXPERIENCE_OPTIONS,
  MOOD_OPTIONS,
  THEME_OPTIONS,
  COMMITMENT_OPTIONS,
} from "./lib/options";

export default function Page() {
  const {
    step,
    experience,
    setExperience,
    mood,
    setMood,
    themes,
    toggleTheme,
    commitment,
    setCommitment,
    results,
    loading,
    error,
    handleFilter,
    handleFindMore,
    canProceed,
    handleNext,
    handleBack,
    handleStartOver,
    goToStep,
    isQuiz,
    isResults,
  } = useQuiz();

  return (
    <div className="bg-background text-white flex flex-col">
      <Header
        isQuiz={isQuiz}
        step={step}
        totalSteps={TOTAL_STEPS}
        onLogoClick={handleStartOver}
      />

      <main className="flex flex-col flex-1 overflow-hidden pt-20 pb-6  min-h-svh">
        {isQuiz && !loading && (
          <ProgressBar
            step={step}
            totalSteps={TOTAL_STEPS}
            onGoToStep={goToStep}
          />
        )}
        <div
          key={step}
          className={[
            "flex flex-col flex-1 items-center px-6 pt-6 md:pt-10 animate-fade-up",
            isResults ? "overflow-y-auto" : "overflow-hidden",
          ].join(" ")}
        >
          {step === 0 && <LandingScreen onStart={() => handleNext()} />}

          {step === 1 && (
            <QuizScreen title="How deep are you into anime?">
              <div className="flex flex-col gap-3">
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <OptionPill
                    key={opt.value}
                    emoji={opt.emoji}
                    label={opt.label}
                    selected={experience === opt.value}
                    onClick={() => setExperience(opt.value)}
                  />
                ))}
              </div>
            </QuizScreen>
          )}

          {step === 2 && (
            <QuizScreen title="What kind of ride are you looking for?">
              <div className="flex flex-col gap-3">
                {MOOD_OPTIONS.map((opt) => (
                  <OptionPill
                    key={opt.value}
                    emoji={opt.emoji}
                    label={opt.label}
                    selected={mood === opt.value}
                    onClick={() => setMood(opt.value)}
                  />
                ))}
              </div>
            </QuizScreen>
          )}

          {step === 3 && (
            <QuizScreen
              title="What should it be about at its core?"
              subtitle="Pick up to 2"
            >
              <div className="flex flex-col gap-3">
                {THEME_OPTIONS.map((opt) => (
                  <OptionPill
                    key={opt.value}
                    emoji={opt.emoji}
                    label={opt.label}
                    selected={themes.includes(opt.value)}
                    onClick={() => toggleTheme(opt.value)}
                  />
                ))}
              </div>
            </QuizScreen>
          )}

          {step === 4 && !loading && (
            <QuizScreen title="How much are you willing to commit?">
              <div className="flex flex-col gap-3">
                {COMMITMENT_OPTIONS.map((opt) => (
                  <OptionPill
                    key={opt.value}
                    emoji={opt.emoji}
                    label={opt.label}
                    selected={commitment === opt.value}
                    onClick={() => setCommitment(opt.value)}
                  />
                ))}
              </div>
            </QuizScreen>
          )}

          {loading && step === TOTAL_STEPS && <LoadingScreen />}

          {isResults && results && (
            <ResultsScreen
              results={results}
              onStartOver={handleStartOver}
              onFilter={handleFilter}
              onFindMore={handleFindMore}
              loading={loading}
              initialCommitment={commitment}
            />
          )}

          {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
        </div>

        {isQuiz && !loading && (
          <div className="shrink-0 px-6 pt-6">
            <BottomNavigation
              step={step}
              totalSteps={TOTAL_STEPS}
              canProceed={canProceed()}
              loading={loading}
              onBack={handleBack}
              onNext={handleNext}
            />
          </div>
        )}
      </main>
    </div>
  );
}
