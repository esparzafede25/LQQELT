const { execSync } = require('child_process');
for (let i = 0; i <= 10; i++) {
  const t = (i * 0.5).toFixed(1);
  execSync(`ffmpeg -y -ss ${t} -i assets/mate-cinematic/pour.mp4 -vframes 1 scratch/pour_${t.replace('.', '_')}.png`);
}
console.log('Sampled pour.mp4 every 0.5s');
