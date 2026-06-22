async function run() {
  const res = await fetch('https://ibb.co/WNzsJJBj');
  const text = await res.text();
  const match = text.match(/<meta property="og:image" content="([^"]+)"/);
  console.log(match?.[1]);
}
run();
