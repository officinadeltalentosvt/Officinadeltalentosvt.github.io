(() => {
  'use strict';
  const video = document.getElementById('digital-education-video');
  const status = document.getElementById('digital-video-status');
  const retry = document.getElementById('digital-video-retry');
  if (!video || !status || !retry) return;
  const manifest = {"file_name":"Officina_Educazione_Digitale_Musica_Sobria.mp4","size":5770420,"sha256":"73ac0825d0f848730f72f0ee233f7b7202efe082cc848f41790b5950a908d0a5","parts":[{"name":"part-00.bin","size":180000},{"name":"part-01.bin","size":180000},{"name":"part-02.bin","size":180000},{"name":"part-03.bin","size":180000},{"name":"part-04.bin","size":180000},{"name":"part-05.bin","size":180000},{"name":"part-06.bin","size":180000},{"name":"part-07.bin","size":180000},{"name":"part-08.bin","size":180000},{"name":"part-09.bin","size":180000},{"name":"part-10.bin","size":180000},{"name":"part-11.bin","size":180000},{"name":"part-12.bin","size":180000},{"name":"part-13.bin","size":180000},{"name":"part-14.bin","size":180000},{"name":"part-15.bin","size":180000},{"name":"part-16.bin","size":180000},{"name":"part-17.bin","size":180000},{"name":"part-18.bin","size":180000},{"name":"part-19.bin","size":180000},{"name":"part-20.bin","size":180000},{"name":"part-21.bin","size":180000},{"name":"part-22.bin","size":180000},{"name":"part-23.bin","size":180000},{"name":"part-24.bin","size":180000},{"name":"part-25.bin","size":180000},{"name":"part-26.bin","size":180000},{"name":"part-27.bin","size":180000},{"name":"part-28.bin","size":180000},{"name":"part-29.bin","size":180000},{"name":"part-30.bin","size":180000},{"name":"part-31.bin","size":180000},{"name":"part-32.bin","size":10420}]};
  let loading = false;
  let ready = false;
  async function loadVideo() {
    if (loading || ready) return;
    loading = true;
    retry.hidden = true;
    status.hidden = false;
    status.textContent = 'Caricamento del video…';
    try {
      const buffers = new Array(manifest.parts.length);
      let next = 0;
      async function worker() {
        while (next < manifest.parts.length) {
          const index = next++;
          const part = manifest.parts[index];
          const response = await fetch('assets/educazione-digitale/' + part.name);
          if (!response.ok) throw new Error('Video unavailable');
          const bytes = await response.arrayBuffer();
          if (bytes.byteLength !== part.size) throw new Error('Incomplete video');
          buffers[index] = bytes;
        }
      }
      await Promise.all(Array.from({length: 6}, worker));
      const blob = new Blob(buffers, {type: 'video/mp4'});
      if (blob.size !== manifest.size) throw new Error('Incomplete video');
      if (window.crypto && window.crypto.subtle) {
        const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
        const hash = Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, '0')).join('');
        if (hash !== manifest.sha256) throw new Error('Video verification failed');
      }
      video.src = URL.createObjectURL(blob);
      video.preload = 'metadata';
      video.load();
      ready = true;
      status.hidden = true;
    } catch (error) {
      status.textContent = 'Il video non si è caricato. Puoi riprovare.';
      retry.hidden = false;
    } finally {
      loading = false;
    }
  }
  retry.addEventListener('click', loadVideo);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        loadVideo();
      }
    }, {rootMargin: '600px'});
    observer.observe(video);
  } else {
    loadVideo();
  }
})();
