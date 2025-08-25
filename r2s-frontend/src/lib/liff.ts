import liff from '@line/liff';

// 개발 환경 체크
const isDevelopment = process.env.NODE_ENV === 'development';

// LIFF 초기화 함수
export async function initializeLiff(): Promise<boolean> {
  try {
    // 개발 환경에서는 mock 처리
    if (isDevelopment) {
      console.log('Development mode: LIFF mock initialized');
      return true;
    }

    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
    if (!liffId) {
      throw new Error('LIFF ID가 설정되지 않았습니다');
    }

    await liff.init({ liffId });
    
    // 로그인 체크
    if (!liff.isLoggedIn()) {
      liff.login();
      return false;
    }

    return true;
  } catch (error) {
    console.error('LIFF 초기화 실패:', error);
    // 개발 환경에서는 에러여도 계속 진행
    return isDevelopment;
  }
}

// LINE 프로필 가져오기
export async function getLiffProfile() {
  try {
    // 개발 환경에서는 mock 데이터 반환
    if (isDevelopment) {
      return {
        userId: 'dev-user-123',
        displayName: 'Developer User',
        pictureUrl: 'https://via.placeholder.com/150',
        statusMessage: 'Testing R2S'
      };
    }

    if (!liff.isLoggedIn()) {
      throw new Error('LINE 로그인이 필요합니다');
    }
    
    const profile = await liff.getProfile();
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage
    };
  } catch (error) {
    console.error('프로필 가져오기 실패:', error);
    // 개발 환경에서는 mock 데이터 반환
    if (isDevelopment) {
      return {
        userId: 'dev-user-123',
        displayName: 'Developer User',
        pictureUrl: 'https://via.placeholder.com/150',
        statusMessage: 'Testing R2S'
      };
    }
    return null;
  }
}

// LIFF 환경 체크
export function isInLiff(): boolean {
  // 개발 환경에서는 false 반환
  if (isDevelopment) {
    return false;
  }
  return typeof window !== 'undefined' && liff.isInClient();
}

// 공유 기능
export async function shareCampaign(campaignId: string, title: string) {
  // 개발 환경에서는 console.log로 대체
  if (isDevelopment) {
    console.log('Development mode: Share campaign', { campaignId, title });
    alert(`개발 모드: "${title}" 캠페인 공유 (ID: ${campaignId})`);
    return;
  }

  if (!liff.isApiAvailable('shareTargetPicker')) {
    throw new Error('공유 기능을 사용할 수 없습니다');
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/campaigns/${campaignId}`;
  
  try {
    await liff.shareTargetPicker([
      {
        type: 'flex',
        altText: `${title} - R2S 공동구매`,
        contents: {
          type: 'bubble',
          hero: {
            type: 'image',
            url: `${process.env.NEXT_PUBLIC_APP_URL}/api/og?id=${campaignId}`,
            size: 'full',
            aspectRatio: '20:13',
            aspectMode: 'cover'
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: title,
                weight: 'bold',
                size: 'xl'
              },
              {
                type: 'text',
                text: '기다림을 할인으로 바꾸는 혁신적인 공동구매',
                size: 'sm',
                color: '#999999',
                margin: 'md'
              }
            ]
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'button',
                style: 'primary',
                action: {
                  type: 'uri',
                  label: '참여하기',
                  uri: shareUrl
                }
              }
            ]
          }
        }
      }
    ]);
  } catch (error) {
    console.error('공유 실패:', error);
    throw error;
  }
}