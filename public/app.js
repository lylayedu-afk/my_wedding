window.PAGE_INVITATION = { "guest": "បង ហ៊ន គីមហាន", "autoScroll": true };
    (() => {
      'use strict';
      const config = window.PAGE_INVITATION;
      const queryGuest = new URLSearchParams(location.search).get('guest');
      const guest = String(queryGuest ?? config.guest ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
      if (guest) document.querySelectorAll('[data-guest-name]').forEach(node => { node.textContent = guest; });
      const opener = document.getElementById('open-invitation-btn');
      const bodyPage = document.getElementById('invitation');
      const content = document.getElementById('invitation-content');
      const control = document.querySelector('.scroll-control');
      const toggle = document.getElementById('scroll-toggle');
      const label = document.getElementById('scroll-label');
      const icon = document.getElementById('scroll-icon');
      const introDialog = document.getElementById('intro-dialog');
      const introVideo = document.getElementById('intro-video');
      let stage = 'closed';
      document.body.dataset.invitationState = 'closed';
      content.setAttribute('aria-hidden', 'true');
      let frame = 0, finished = false;
      function update(running) {
        const text = running ? 'ផ្អាករំកិល' : finished ? 'រំកិលម្តងទៀត' : 'បន្តរំកិល';
        toggle.setAttribute('aria-pressed', String(running));
        toggle.setAttribute('aria-label', text);
        label.textContent = text;
        icon.textContent = running ? 'Ⅱ' : '▶';
      }
      function pause(atEnd = false) {
        cancelAnimationFrame(frame);
        frame = 0;
        finished = atEnd;
        document.documentElement.classList.remove('is-auto-scrolling');
        update(false);
      }
      function start(fromCover = false) {
        pause();
        document.documentElement.classList.add('is-auto-scrolling');
        const begun = performance.now(), initial = window.scrollY;
        const target = Math.max(0, initial + bodyPage.getBoundingClientRect().top - 18);
        const transition = fromCover && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 900 : 0;
        let position = fromCover && !transition ? target : initial, previous = begun;
        update(true);
        function step(now) {
          const maximum = Math.max(0, document.documentElement.scrollHeight - innerHeight);
          const elapsed = now - begun, delta = Math.min(100, Math.max(0, now - previous));
          previous = now;
          if (elapsed < transition) {
            const progress = elapsed / transition;
            position = initial + (target - initial) * progress * progress * (3 - 2 * progress);
          } else if (fromCover && elapsed < transition + 1500) {
            position = target;
          } else {
            position += 28 * delta / 1000;
          }
          window.scrollTo(0, Math.min(position, maximum));
          if (position >= maximum - 1 && elapsed >= transition) { pause(true); return; }
          frame = requestAnimationFrame(step);
        }
        frame = requestAnimationFrame(step);
      }
      function revealInvitation() {
        if (stage === 'open') return;
        stage = 'open';
        introVideo?.pause();
        if (introDialog?.open) introDialog.close();
        document.documentElement.classList.remove('intro-playing');
        opener.disabled = false;
        opener.removeAttribute('aria-busy');
        document.body.dataset.invitationState = 'open';
        content.removeAttribute('aria-hidden');
        opener.setAttribute('aria-expanded', 'true');
        bodyPage.focus({ preventScroll: true });
        control.hidden = false;
        startWeddingMusic();
        if (config.autoScroll) start(true);
        else {
          bodyPage.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
          update(false);
        }
      }
      opener.addEventListener('click', () => {
        if (stage === 'open') {
          bodyPage.scrollIntoView({ behavior: 'smooth' });
          return;
        }
        if (stage === 'intro') return;
        if (!introDialog || !introVideo || typeof introDialog.showModal !== 'function') {
          revealInvitation();
          return;
        }
        stage = 'intro';
        document.body.dataset.invitationState = 'intro';
        opener.disabled = true;
        opener.setAttribute('aria-busy', 'true');
        document.documentElement.classList.add('intro-playing');
        introDialog.showModal();
        introVideo.src = introVideo.dataset.src;
        introVideo.play().catch(() => {
          if (stage === 'intro') document.getElementById('intro-status').textContent = 'ចុចប៊ូតុងចាក់វីដេអូ ឬរំលងដើម្បីបើកធៀប';
        });
        document.getElementById('skip-intro').focus();
      });
      if (introDialog && introVideo) {
        const play = document.getElementById('intro-play');
        const sound = document.getElementById('intro-sound');
        const status = document.getElementById('intro-status');
        const clock = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
        function syncIntro() {
          play.textContent = introVideo.paused ? '▶' : 'Ⅱ';
          play.setAttribute('aria-label', introVideo.paused ? 'ចាក់វីដេអូ' : 'ផ្អាកវីដេអូ');
          sound.textContent = introVideo.muted ? 'បើកសំឡេង' : 'បិទសំឡេង';
          sound.setAttribute('aria-label', sound.textContent);
          sound.setAttribute('aria-pressed', String(introVideo.muted));
          const duration = Number.isFinite(introVideo.duration) ? introVideo.duration : 0;
          document.getElementById('intro-time').textContent = `${clock(introVideo.currentTime)} / ${clock(duration)}`;
          document.getElementById('intro-progress').value = duration ? introVideo.currentTime / duration : 0;
        }
        document.getElementById('skip-intro').addEventListener('click', revealInvitation);
        introVideo.addEventListener('ended', revealInvitation);
        introDialog.addEventListener('cancel', event => { event.preventDefault(); revealInvitation(); });
        introDialog.addEventListener('close', () => { if (stage === 'intro') revealInvitation(); });
        for (const event of ['play', 'pause', 'timeupdate', 'loadedmetadata', 'volumechange']) introVideo.addEventListener(event, syncIntro);
        introVideo.addEventListener('waiting', () => { status.textContent = 'កំពុងផ្ទុកវីដេអូ… អ្នកអាចរំលងបាន'; });
        introVideo.addEventListener('playing', () => { status.textContent = 'រំលង ឬរង់ចាំវីដេអូចប់ ដើម្បីបើកធៀប'; });
        introVideo.addEventListener('error', () => { status.textContent = 'មិនអាចចាក់វីដេអូបានទេ។ សូមរំលងដើម្បីបើកធៀប។'; });
        play.addEventListener('click', () => {
          if (!introVideo.paused) introVideo.pause();
          else introVideo.play().catch(() => { status.textContent = 'មិនអាចចាក់វីដេអូបានទេ។ សូមរំលងដើម្បីបើកធៀប។'; });
        });
        sound.addEventListener('click', () => { introVideo.muted = !introVideo.muted; });
      }
      toggle.addEventListener('click', () => { if (frame) pause(); else start(finished); });
      const manual = event => {
        if (event.target instanceof Element && event.target.closest('.scroll-control, #open-invitation-btn, #music-toggle')) return;
        if (frame) pause();
      };
      window.addEventListener('wheel', manual, { passive: true });
      window.addEventListener('touchstart', manual, { passive: true });
      document.addEventListener('pointerdown', manual, { passive: true });
      document.addEventListener('keydown', event => { if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) manual(event); });
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) return;
        if (frame) pause();
        if (stage === 'intro') introVideo?.pause();
      });
      const gallery = [...document.querySelectorAll('.gallery-photo')];
      const lightbox = document.getElementById('lightbox');
      if (gallery.length && lightbox) {
        const image = document.getElementById('lightbox-image');
        const close = lightbox.querySelector('.lightbox-close');
        const previous = lightbox.querySelector('.lightbox-prev');
        const next = lightbox.querySelector('.lightbox-next');
        const toKhmer = number => String(number).replace(/\d/g, digit => '០១២៣៤៥៦៧៨៩'[Number(digit)]);
        let index = 0, galleryOpener;
        function showPhoto(nextIndex) {
          index = (nextIndex + gallery.length) % gallery.length;
          const link = gallery[index];
          image.src = link.href;
          image.alt = link.querySelector('img').alt;
          document.getElementById('lightbox-caption').textContent = link.dataset.caption;
          document.getElementById('lightbox-count').textContent = `${toKhmer(index + 1)} / ${toKhmer(gallery.length)}`;
        }
        previous.disabled = next.disabled = gallery.length === 1;
        gallery.forEach((link, photoIndex) => link.addEventListener('click', event => {
          if (typeof lightbox.showModal !== 'function' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          pause();
          galleryOpener = link;
          showPhoto(photoIndex);
          lightbox.showModal();
          document.documentElement.classList.add('gallery-open');
          close.focus();
        }));
        close.addEventListener('click', () => lightbox.close());
        previous.addEventListener('click', () => showPhoto(index - 1));
        next.addEventListener('click', () => showPhoto(index + 1));
        lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
        lightbox.addEventListener('keydown', event => {
          if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(index - 1); }
          if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(index + 1); }
        });
        lightbox.addEventListener('close', () => {
          document.documentElement.classList.remove('gallery-open');
          image.removeAttribute('src');
          galleryOpener?.focus({ preventScroll: true });
        });
      }
      const musicSource = document.getElementById('wedding-music');
      const music = document.getElementById('music-toggle');
      // Reuse the video element already started by the guest. Safari grants
      // playback permission per media element; the fallback is for no-video pages.
      const musicPlayer = introVideo || musicSource;
      let musicStarted = false;
      let musicNeedsPlay = false;

      function syncWeddingMusic() {
        if (!music || !musicPlayer || !musicStarted) return;
        const needsPlay = musicNeedsPlay || musicPlayer.paused;
        const muted = musicPlayer.muted;
        const text = needsPlay ? 'ចាក់តន្ត្រី' : muted ? 'បើកសំឡេង' : 'បិទសំឡេង';
        music.setAttribute('aria-pressed', String(muted));
        music.setAttribute('aria-label', needsPlay ? text : `${text}តន្ត្រី`);
        document.getElementById('music-label').textContent = text;
      }

      function startWeddingMusic() {
        if (!musicSource || !music || !musicPlayer || stage !== 'open') return;
        if (!musicStarted) {
          musicStarted = true;
          musicPlayer.loop = true;
          musicPlayer.volume = .45;
          musicPlayer.dataset.playback = 'music';
          musicPlayer.src = musicSource.dataset.src;
        }
        musicNeedsPlay = false;
        document.getElementById('music-status').textContent = '';
        if (musicPlayer.error) musicPlayer.load();
        const request = musicPlayer.play();
        syncWeddingMusic();
        if (request && typeof request.then === 'function') {
          request.then(() => {
            musicNeedsPlay = false;
            syncWeddingMusic();
          }).catch(() => {
            musicNeedsPlay = true;
            document.getElementById('music-status').textContent = 'ចុចប៊ូតុងចាក់តន្ត្រី ដើម្បីបើកបទចម្រៀង។';
            syncWeddingMusic();
          });
        }
      }

      if (musicSource && music && musicPlayer) {
        music.addEventListener('click', () => {
          if (!musicStarted || musicNeedsPlay || musicPlayer.paused) {
            musicPlayer.muted = false;
            startWeddingMusic();
          } else {
            musicPlayer.muted = !musicPlayer.muted;
            syncWeddingMusic();
          }
        });
        for (const event of ['play', 'playing', 'pause', 'volumechange', 'ended']) {
          musicPlayer.addEventListener(event, syncWeddingMusic);
        }
        musicPlayer.addEventListener('error', () => {
          if (!musicStarted) return;
          musicNeedsPlay = true;
          document.getElementById('music-status').textContent = 'មិនអាចចាក់តន្ត្រីបានទេ។ សូមចុចដើម្បីព្យាយាមម្តងទៀត។';
          syncWeddingMusic();
        });
      }

    })();
