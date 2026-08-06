import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Digital Experiences That People Remember';
    const category = searchParams.get('category') || 'Innovatech Solutions';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#06070A',
            backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(59,130,246,0.15) 0%, transparent 60%)',
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#3B82F6',
              }}
            />
            <span
              style={{
                color: '#06B6D4',
                fontSize: '20px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              DEVZITE · {category}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h1
              style={{
                fontSize: '60px',
                fontWeight: 900,
                color: '#F8FAFC',
                lineHeight: 1.1,
                margin: 0,
                maxWidth: '900px',
              }}
            >
              {title}
            </h1>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: '32px',
            }}
          >
            <span style={{ color: '#94A3B8', fontSize: '18px' }}>
              innovatechsolutions.com
            </span>
            <span style={{ color: '#3B82F6', fontSize: '18px', fontWeight: 'bold' }}>
              Next.js 15 · GSAP · R3F
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG image`, { status: 500 });
  }
}
