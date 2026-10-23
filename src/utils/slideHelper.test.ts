import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeSlides, moveSlide, sanitizeForFirestore } from './slideHelper';

test('sanitizeSlides assigns valid ids and replaces empty urls', () => {
  const input = [
    { id: '', image_url: '', title: '  Slide 1  ', caption: undefined },
    { id: 'custom-id', image_url: 'https://example.com/pic.jpg', title: undefined, caption: 'Caption text' },
  ];
  const sanitized = sanitizeSlides(input);
  
  assert.equal(sanitized.length, 2);
  assert.ok(sanitized[0].id.startsWith('sl-'));
  assert.ok(sanitized[0].image_url.includes('unsplash'));
  assert.equal(sanitized[0].title, 'Slide 1');
  assert.equal(sanitized[0].caption, ''); // Never undefined!
  
  assert.equal(sanitized[1].id, 'custom-id');
  assert.equal(sanitized[1].image_url, 'https://example.com/pic.jpg');
  assert.equal(sanitized[1].title, ''); // Never undefined!
  assert.equal(sanitized[1].caption, 'Caption text');
});

test('moveSlide correctly shifts slides up and down', () => {
  const slides = [
    { id: '1', image_url: 'img1', title: 'First', caption: '' },
    { id: '2', image_url: 'img2', title: 'Second', caption: '' },
    { id: '3', image_url: 'img3', title: 'Third', caption: '' },
  ];

  const movedDown = moveSlide(slides, 0, 'down');
  assert.equal(movedDown[0].id, '2');
  assert.equal(movedDown[1].id, '1');
  assert.equal(movedDown[2].id, '3');

  const movedUp = moveSlide(movedDown, 1, 'up');
  assert.equal(movedUp[0].id, '1');
  assert.equal(movedUp[1].id, '2');
  assert.equal(movedUp[2].id, '3');

  // Boundaries
  assert.deepEqual(moveSlide(slides, 0, 'up'), slides);
  assert.deepEqual(moveSlide(slides, 2, 'down'), slides);
});

test('sanitizeForFirestore eliminates undefined keys', () => {
  const input = {
    title: 'Test Page',
    audio_file_id: undefined,
    slides: [
      { id: 's1', title: 'Slide 1', caption: undefined },
    ],
  };

  const clean = sanitizeForFirestore(input) as Record<string, unknown>;
  assert.equal(clean.title, 'Test Page');
  assert.equal('audio_file_id' in clean, false);
  const cleanSlides = clean.slides as Record<string, unknown>[];
  assert.equal('caption' in cleanSlides[0], false);
});
