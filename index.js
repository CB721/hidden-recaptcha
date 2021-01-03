let Recaptcha = {};

Recaptcha.init = function () {
  console.log('init')
  if (Recaptcha.tracking()) {
    grecaptcha.ready(function () {
      if (document.grecaptchaClientId) grecaptcha.reset(document.grecaptchaClientId);
      document.grecaptchaClientId = grecaptcha.render('recaptcha-badge', {
        sitekey: Recaptcha.siteKey(),
        badge: 'inline', // must be inline
        size: 'invisible' // must be invisible
      });
    });
  };
};

Recaptcha.load = function () {
  console.log('load')
  grecaptcha.ready(function () {
    if (Recaptcha.initialized()) {
      if (document.grecaptchaClientId) Recaptcha.init();
      document.querySelectorAll('form[data-recaptcha]').forEach((el) => {
        Recaptcha.attach(el, 'submit');
      });
    } else {
      console.log('Recaptcha: not initialized');
    };
  });
};

Recaptcha.attach = function (el, on) {
  console.log('attach')
  if (el.getAttribute('data-recaptcha-initialized') == true) return;
  console.log('attaching...')

  el.addEventListener(on, (event) => {
    event.preventDefault();

    grecaptcha.ready(function () {
      var res = grecaptcha.execute(
        document.grecaptchaClientId,
        { action: el.getAttribute('data-recaptcha') }
      ).then(function (token) {
        el.setAttribute('data-remote', true);
        el.setAttribute('data-recaptcha-token', token);
        Rails.handleRemote.call(el, event);
      }).catch((err) => { console.log('Recaptcha: [Execute]', err) });
    });
  });
  el.setAttribute('data-recaptcha-initialized', true);
};

Recaptcha.tracking = function () {
  console.log('tracking')
  var isTracking = Recaptcha.siteKey().length > 0;
  if (isTracking) {
    console.log('Recaptcha: tracking');
  }
  return isTracking;
};

Recaptcha.initialized = function () {
  console.log('initialized')
  var badge = document.querySelector('.grecaptcha-badge');
  if (badge) {
    console.log('Recaptcha: initialized');
  }
  return badge;
};

Recaptcha.siteKey = function () {
  console.log('siteKey')
  var meta = document.querySelector('meta[name=recaptcha-site]'),
    siteKey = '';
  if (meta) siteKey = meta.getAttribute('content');
  return siteKey;
};

Recaptcha.init();

module.exports = Recaptcha;
