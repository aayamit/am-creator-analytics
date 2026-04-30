/**
 * Creator Onboarding Wizard
 * Multi-step onboarding with video intros
 * Self-hosted videos on MinIO (saves vs Vimeo)
 */

'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, ArrowLeft, ArrowRight, Play } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  videoSrc?: string; // Self-hosted on MinIO
}

const ONBOARDING_STEPS: Step[] = [
  {
    id: 1,
    title: 'Welcome to AM Creator Analytics',
    description: 'Discover how our platform helps you monetize your influence. Watch this 2-minute intro.',
    videoSrc: '/videos/onboarding/welcome.mp4',
  },
  {
    id: 2,
    title: 'Complete Your Profile',
    description: 'Add your social handles, niche, and audience demographics.',
    videoSrc: '/videos/onboarding/profile.mp4',
  },
  {
    id: 3,
    title: 'Connect Your Accounts',
    description: 'Link your social media accounts to track performance automatically.',
    videoSrc: '/videos/onboarding/connect-accounts.mp4',
  },
  {
    id: 4,
    title: 'Set Your Rates',
    description: 'Define your pricing for different campaign types.',
    videoSrc: '/videos/onboarding/rates.mp4',
  },
  {
    id: 5,
    title: 'Browse Campaigns',
    description: 'Explore active campaigns and submit your first pitch.',
    videoSrc: '/videos/onboarding/browse.mp4',
  },
  {
    id: 6,
    title: 'You\'re All Set! 🎉',
    description: 'Your profile is live. Check your dashboard for new opportunities.',
  },
];

interface CreatorOnboardingWizardProps {
  userId: string;
  onComplete?: () => void;
}

export default function CreatorOnboardingWizard({
  userId,
  onComplete,
}: CreatorOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [videoWatched, setVideoWatched] = useState(false);

  const progress = (completedSteps.length / ONBOARDING_STEPS.length) * 100;
  const currentStepData = ONBOARDING_STEPS[currentStep - 1];

  const handleNext = useCallback(() => {
    if (currentStep < ONBOARDING_STEPS.length) {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep(currentStep + 1);
      setVideoWatched(false);
    } else {
      // Onboarding complete
      onComplete?.();
    }
  }, [currentStep, onComplete]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSkipVideo = useCallback(() => {
    setVideoWatched(true);
  }, []);

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '32px 16px',
      fontFamily: 'Inter, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{
          margin: '0 0 8px 0',
          fontSize: '28px',
          fontWeight: 600,
          color: '#1a1a2e',
        }}>
          Creator Onboarding
        </h1>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#92400e',
          opacity: 0.8,
        }}>
          Step {currentStep} of {ONBOARDING_STEPS.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '32px' }}>
        <Progress value={progress} style={{ height: '8px' }} />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '12px',
        }}>
          {ONBOARDING_STEPS.map((step) => (
            <div
              key={step.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {completedSteps.includes(step.id) ? (
                <CheckCircle size={20} style={{ color: '#16a34a' }} />
              ) : currentStep === step.id ? (
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#1a1a2e',
                  color: '#F8F7F4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                }}>
                  {step.id}
                </div>
              ) : (
                <Circle size={20} style={{ color: '#e5e7eb' }} />
              )}
              <span style={{
                fontSize: '11px',
                color: completedSteps.includes(step.id) ? '#16a34a' : '#92400e',
                fontWeight: completedSteps.includes(step.id) ? 600 : 400,
              }}>
                {step.title.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Card */}
      <Card style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        <CardHeader style={{
          backgroundColor: '#F8F7F4',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <CardTitle style={{
            color: '#1a1a2e',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {currentStepData.title}
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '24px' }}>
          <p style={{
            margin: '0 0 24px 0',
            fontSize: '14px',
            color: '#1a1a2e',
            lineHeight: 1.6,
          }}>
            {currentStepData.description}
          </p>

          {/* Video Player (Self-hosted) */}
          {currentStepData.videoSrc && (
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden',
              borderRadius: '8px',
              backgroundColor: '#1a1a2e',
              marginBottom: '24px',
            }}>
              <video
                controls
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
                onEnded={() => setVideoWatched(true)}
              >
                <source src={currentStepData.videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Play button overlay (if needed) */}
              {!videoWatched && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '64px',
                  height: '64px',
                  backgroundColor: 'rgba(26, 26, 46, 0.8)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  const video = document.querySelector('video');
                  video?.play();
                }}
                >
                  <Play size={32} style={{ color: '#F8F7F4', marginLeft: '4px' }} />
                </div>
              )}
            </div>
          )}

          {/* Step Content (Form fields would go here) */}
          <div style={{
            padding: '20px',
            backgroundColor: '#F8F7F4',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            marginBottom: '24px',
          }}>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#92400e',
              textAlign: 'center',
            }}>
              📝 Form fields for &quot;{currentStepData.title}&quot; would go here
            </p>
          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              style={{
                visibility: currentStep === 1 ? 'hidden' : 'visible',
              }}
            >
              <ArrowLeft size={16} style={{ marginRight: '8px' }} />
              Back
            </Button>

            <div style={{ display: 'flex', gap: '8px' }}>
              {currentStepData.videoSrc && (
                <Button
                  variant="ghost"
                  onClick={handleSkipVideo}
                  style={{ color: '#92400e' }}
                >
                  Skip Video
                </Button>
              )}

              <Button
                onClick={handleNext}
                style={{
                  backgroundColor: '#1a1a2e',
                  color: '#F8F7F4',
                }}
              >
                {currentStep === ONBOARDING_STEPS.length ? (
                  'Complete Onboarding 🎉'
                ) : (
                  <>
                    Continue
                    <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <p style={{
        textAlign: 'center',
        marginTop: '24px',
        fontSize: '12px',
        color: '#92400e',
        opacity: 0.7,
      }}>
        💡 Tip: Videos are hosted on our self-hosted MinIO storage (saves $75-99/month vs Vimeo/Wistia)
      </p>
    </div>
  );
}
