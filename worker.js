export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // ─── Anthropic API 프록시 ───
    if (path === '/' || path === '') {
      try {
        const body = await request.json();
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // ─── Stripe 결제 인텐트 생성 ───
    if (path === '/stripe/create-payment-intent') {
      try {
        const { amount, currency, productName, userId } = await request.json();

        const params = new URLSearchParams();
        params.append('amount', Math.round(amount));
        params.append('currency', currency || 'krw');
        params.append('metadata[product_name]', productName || '');
        params.append('metadata[user_id]', userId || '');
        params.append('automatic_payment_methods[enabled]', 'true');

        const response = await fetch('https://api.stripe.com/v1/payment_intents', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + env.STRIPE_SECRET_KEY,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // ─── Stripe 결제 확인 ───
    if (path === '/stripe/verify-payment') {
      try {
        const { paymentIntentId } = await request.json();

        const response = await fetch(
          'https://api.stripe.com/v1/payment_intents/' + paymentIntentId,
          {
            headers: {
              'Authorization': 'Bearer ' + env.STRIPE_SECRET_KEY,
            },
          }
        );

        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // ─── Stripe 구독 생성 ───
    if (path === '/stripe/create-subscription') {
      try {
        const { email, priceId, userId, productName } = await request.json();

        const customerParams = new URLSearchParams();
        customerParams.append('email', email);
        customerParams.append('metadata[user_id]', userId);
        customerParams.append('metadata[product_name]', productName || '');

        const customerRes = await fetch('https://api.stripe.com/v1/customers', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + env.STRIPE_SECRET_KEY,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: customerParams.toString(),
        });
        const customer = await customerRes.json();

        const sessionParams = new URLSearchParams();
        sessionParams.append('customer', customer.id);
        sessionParams.append('mode', 'subscription');
        sessionParams.append('line_items[0][price]', priceId);
        sessionParams.append('line_items[0][quantity]', '1');
        sessionParams.append('success_url', 'https://saju-today.com/my?stripe=success');
        sessionParams.append('cancel_url', 'https://saju-today.com/pricing?stripe=cancel');
        sessionParams.append('metadata[user_id]', userId);

        const sessionRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + env.STRIPE_SECRET_KEY,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: sessionParams.toString(),
        });
        const session = await sessionRes.json();

        return new Response(JSON.stringify(session), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  }
};
