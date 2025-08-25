'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCampaignById } from '@/lib/mockData';
import { Campaign } from '@/types';
import { ROUTES } from '@/constants';

interface ExtendedCampaign extends Campaign {
  quantity?: string;
  depositAmount?: number;
  currentSavings?: number;
  savedAmount?: number;
  completedDate?: string;
}

export default function MyParticipationView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newParticipationId = searchParams.get('newParticipation');
  const [totalSavings, setTotalSavings] = useState(12.00);
  const [savingsRate] = useState(0.3);
  
  const ongoingCampaigns: ExtendedCampaign[] = [
    {
      id: '1',
      category: '원두',
      categoryIcon: '☕',
      title: '블루마운틴 프리미엄 원두',
      quantity: '1kg × 1개 참여',
      status: 'ongoing',
      discountPercent: 12,
      originalPrice: 100.00,
      discountedPrice: 88.00,
      depositAmount: 100.00,
      currentSavings: 12.00,
      currentParticipants: 38,
      minParticipants: 50,
      timeRemaining: '13:45:22',
      progress: 76
    }
  ];

  const completedCampaigns = [
    {
      id: '2',
      category: '폰',
      categoryIcon: '📱',
      title: '갤럭시 S24 울트라',
      quantity: '256GB × 1개',
      status: 'completed' as const,
      savedAmount: 84,
      completedDate: '2024.08.01'
    },
    {
      id: '3',
      category: '의류',
      categoryIcon: '👗',
      title: '명품 겨울 코트',
      quantity: 'FREE × 1개',
      status: 'completed' as const,
      savedAmount: 48,
      completedDate: '2024.07.15'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSavings(prev => prev + savingsRate / 3600);
    }, 1000);

    return () => clearInterval(interval);
  }, [savingsRate]);

  const handleCampaignClick = (campaignId: string) => {
    const campaign = getCampaignById(campaignId);
    if (campaign?.status === 'completed') {
      router.push(`${ROUTES.settlementComplete}?campaignId=${campaignId}`);
    } else {
      router.push(`${ROUTES.campaignDetail(campaignId)}`);
    }
  };

  return (
    <div 
      className="r2s-mobile-container"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '375px',
        minWidth: '320px',
        height: '812px', // 정확한 높이 지정
        margin: '0 auto',
        background: '#FFFFFF',
        fontFamily: 'Inter, sans-serif',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Header Section */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '88px',
          background: 'linear-gradient(180deg, #00B833 0%, #00C73C 100%)',
        }}
      >
        {/* Title */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '14px',
            transform: 'translateX(-50%)',
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '19px',
            textAlign: 'center',
            color: '#FFFFFF',
          }}
        >
          내 참여 현황
        </div>

        {/* Menu Icon */}
        <div
          style={{
            position: 'absolute',
            right: '18px',
            top: '10px',
            width: '24px',
            height: '24px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '3px',
              height: '3px',
              background: '#FFFFFF',
              borderRadius: '50%',
            }}
          />
        </div>

        {/* Current participation count */}
        <div
          style={{
            position: 'absolute',
            left: '20px',
            top: '56px',
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '17px',
            color: '#FFFFFF',
          }}
        >
          현재 {ongoingCampaigns.length}개 캠페인 참여중
        </div>

        {/* Real-time update */}
        <div
          style={{
            position: 'absolute',
            right: '20px',
            top: '57px',
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '15px',
            color: '#FFFFFF',
          }}
        >
          실시간 업데이트
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '664px', // 812px - 88px header - 60px bottom nav = 664px
          overflowY: 'auto',
          overflowX: 'hidden',
          background: '#F8F9FA',
          paddingBottom: '20px',
        }}
      >
        {/* Total Discount Benefits Card */}
        <div
          style={{
            margin: '16px 20px 20px',
            padding: '16px',
            background: '#00C73C',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 199, 60, 0.2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '17px',
                color: '#FFFFFF',
              }}
            >
              💰 총 할인 혜택
            </div>
            <div
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '15px',
                color: '#FFFFFF',
                opacity: 0.9,
              }}
            >
              누적 절약
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
            <div
              style={{
                fontFamily: 'Inter',
                fontWeight: 700,
                fontSize: '30px',
                lineHeight: '36px',
                color: '#FFFFFF',
                marginRight: '8px',
              }}
            >
              {totalSavings.toFixed(2)}
            </div>
            <div
              style={{
                fontFamily: 'Inter',
                fontWeight: 700,
                fontSize: '18px',
                lineHeight: '22px',
                color: '#FFFFFF',
              }}
            >
              USDT
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '15px',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              원가 대비 12% 할인
            </div>
            <div
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '15px',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              ⬆ +{savingsRate} USDT/시간
            </div>
          </div>

          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '11px',
              lineHeight: '13px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginTop: '4px',
            }}
          >
            시간이 지날수록 더 많이 절약돼요!
          </div>
        </div>

        {/* Ongoing Campaigns Section */}
        <div style={{ margin: '0 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div
              style={{
                fontFamily: 'Inter',
                fontWeight: 700,
                fontSize: '18px',
                lineHeight: '22px',
                color: '#212529',
              }}
            >
              진행중 캠페인
            </div>
            <div
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '15px',
                color: '#6C757D',
              }}
            >
              {ongoingCampaigns.length}개
            </div>
          </div>

          {/* Ongoing Campaign Cards */}
          {ongoingCampaigns.map((campaign, index) => (
            <div
              key={campaign.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E9ECEF',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              }}
              onClick={() => handleCampaignClick(campaign.id)}
            >
              {/* Header Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {/* Category Icon */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: '#8B4513',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                    }}
                  >
                    <div style={{ fontSize: '14px', lineHeight: '17px', color: '#FFFFFF' }}>
                      {campaign.categoryIcon}
                    </div>
                    <div style={{ fontSize: '8px', lineHeight: '10px', color: '#FFFFFF' }}>
                      {campaign.category}
                    </div>
                  </div>

                  {/* Title and Quantity */}
                  <div>
                    <div
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 700,
                        fontSize: '16px',
                        lineHeight: '19px',
                        color: '#212529',
                        marginBottom: '4px',
                      }}
                    >
                      {campaign.title}
                    </div>
                    <div
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 400,
                        fontSize: '13px',
                        lineHeight: '16px',
                        color: '#6C757D',
                      }}
                    >
                      {campaign.quantity}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div
                  style={{
                    background: '#28A745',
                    padding: '4px 8px',
                    borderRadius: '4px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 700,
                      fontSize: '11px',
                      lineHeight: '13px',
                      color: '#FFFFFF',
                    }}
                  >
                    참여중
                  </div>
                </div>
              </div>

              {/* Campaign Details */}
              <div
                style={{
                  background: '#F8F9FA',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6C757D' }}>
                    현재 할인율
                  </span>
                  <span
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 700,
                      fontSize: '18px',
                      color: '#DC3545',
                    }}
                  >
                    {campaign.discountPercent}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6C757D' }}>
                    예치 금액
                  </span>
                  <span
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 700,
                      fontSize: '14px',
                      color: '#212529',
                    }}
                  >
                    {campaign.depositAmount?.toFixed(2)} USDT
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 700,
                      fontSize: '12px',
                      color: '#28A745',
                    }}
                  >
                    현재 절약
                  </span>
                  <span
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 700,
                      fontSize: '14px',
                      color: '#28A745',
                    }}
                  >
                    {campaign.currentSavings?.toFixed(2)} USDT
                  </span>
                </div>
              </div>

              {/* Progress and Timer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '12px',
                    color: '#6C757D',
                  }}
                >
                  참여자 {campaign.currentParticipants}/{campaign.minParticipants}명 ({campaign.progress}%)
                </span>
                <span
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    fontSize: '12px',
                    color: '#856404',
                  }}
                >
                  ⏰ {campaign.timeRemaining}
                </span>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  width: '100%',
                  height: '4px',
                  background: '#E9ECEF',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${campaign.progress}%`,
                    height: '100%',
                    background: '#28A745',
                    borderRadius: '2px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Expected Final Payment Section */}
        <div
          style={{
            margin: '0 20px 20px',
            padding: '16px',
            background: '#E8F5E8',
            border: '1px solid #C8E6C9',
            borderRadius: '12px',
          }}
        >
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '19px',
              color: '#2E7D32',
              marginBottom: '12px',
            }}
          >
            💡 예상 최종 결제액
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div
              style={{
                fontFamily: 'Inter',
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: '17px',
                color: '#000000',
              }}
            >
              현재 기준
            </div>
            <div
              style={{
                fontFamily: 'Inter',
                fontWeight: 700,
                fontSize: '18px',
                lineHeight: '22px',
                color: '#DC3545',
              }}
            >
              88.00 USDT
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '15px',
                color: '#2E7D32',
              }}
            >
              목표 달성 시 최대
            </div>
            <div
              style={{
                fontFamily: 'Inter',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '19px',
                color: '#2E7D32',
              }}
            >
              85.00 USDT
            </div>
          </div>
        </div>

        {/* Completed Campaigns Section */}
        <div style={{ margin: '0 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div
              style={{
                fontFamily: 'Inter',
                fontWeight: 700,
                fontSize: '18px',
                lineHeight: '22px',
                color: '#212529',
              }}
            >
              완료된 캠페인
            </div>
            <div
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '15px',
                color: '#6C757D',
              }}
            >
              {completedCampaigns.length}개
            </div>
          </div>

          {/* Completed Campaign Cards */}
          {completedCampaigns.map((campaign, index) => (
            <div
              key={campaign.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E9ECEF',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              }}
              onClick={() => handleCampaignClick(campaign.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  {/* Category Icon */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: campaign.categoryIcon === '📱' ? '#4A90E2' : '#E91E63',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                    }}
                  >
                    <div style={{ fontSize: '12px', lineHeight: '15px', color: '#FFFFFF' }}>
                      {campaign.categoryIcon}
                    </div>
                    <div style={{ fontSize: '7px', lineHeight: '8px', color: '#FFFFFF' }}>
                      {campaign.category}
                    </div>
                  </div>

                  {/* Campaign Info */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 700,
                        fontSize: '14px',
                        lineHeight: '17px',
                        color: '#212529',
                        marginBottom: '4px',
                      }}
                    >
                      {campaign.title}
                    </div>
                    <div
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '15px',
                        color: '#6C757D',
                        marginBottom: '8px',
                      }}
                    >
                      {campaign.quantity}
                    </div>
                    <div
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 700,
                        fontSize: '12px',
                        lineHeight: '15px',
                        color: '#28A745',
                      }}
                    >
                      {campaign.savedAmount} USDT 절약
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {/* Status Badge */}
                  <div
                    style={{
                      background: '#6C757D',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      marginBottom: '8px',
                      display: 'inline-block',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 400,
                        fontSize: '10px',
                        lineHeight: '12px',
                        color: '#FFFFFF',
                      }}
                    >
                      완료
                    </div>
                  </div>

                  {/* Date */}
                  <div
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 400,
                      fontSize: '11px',
                      lineHeight: '13px',
                      color: '#6C757D',
                    }}
                  >
                    {campaign.completedDate}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '60px',
          background: '#FFFFFF',
          borderTop: '1px solid #E9ECEF',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 1000,
        }}
      >
        {/* 홈 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => router.push(ROUTES.campaigns)}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              background: '#ADB5BD',
              borderRadius: '4px',
              marginBottom: '4px',
            }}
          />
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '11px',
              lineHeight: '13px',
              color: '#6C757D',
            }}
          >
            홈
          </div>
        </div>

        {/* 내 참여 - Active */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              background: '#00C73C',
              borderRadius: '4px',
              marginBottom: '4px',
            }}
          />
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: '11px',
              lineHeight: '13px',
              color: '#00C73C',
            }}
          >
            내 참여
          </div>
        </div>

        {/* 알림 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              background: '#ADB5BD',
              borderRadius: '4px',
              marginBottom: '4px',
            }}
          />
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '11px',
              lineHeight: '13px',
              color: '#6C757D',
            }}
          >
            알림
          </div>
        </div>

        {/* 더보기 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              background: '#ADB5BD',
              borderRadius: '4px',
              marginBottom: '4px',
            }}
          />
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '11px',
              lineHeight: '13px',
              color: '#6C757D',
            }}
          >
            더보기
          </div>
        </div>
      </div>
    </div>
  );
}