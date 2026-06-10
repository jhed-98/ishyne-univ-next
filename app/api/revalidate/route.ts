import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const type = body?._type as string | undefined;

    // Revalidate all locale paths
    const locales = ['es', 'en', 'pt'];

    if (!type || type === 'product') {
      for (const locale of locales) {
        revalidatePath(`/${locale}`, 'page');
        revalidatePath(`/${locale}/productos`, 'page');
      }
    }
    if (!type || type === 'campaign' || type === 'settings') {
      for (const locale of locales) {
        revalidatePath(`/${locale}`, 'layout');
      }
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: type ?? 'all',
    });
  } catch {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
