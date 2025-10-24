// Convert the specific Maahinna United team data

const { convertToLatestFormat, validateFormat } = require('./convert-to-latest-format');

const maahhinnaData = {
  "submissionDate": "2025-10-23T18:12:48.311Z",
  "teamList": "PLAYERS:\nJersey,Name,Position,ID_URL\n99,Ahmed lubaan ali hafeez,GK,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761203557/fmsc-2025/ids/players/wihi7f17zz0dmuat3hzh.jpg\n27,Mohamed afsar,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761203601/fmsc-2025/ids/players/tdqj8bnhvyoioiljm5dn.jpg\n23,Ali sham,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761203664/fmsc-2025/ids/players/yobhiijcnluvvuxelhbp.jpg\n13,Hassan zaidh,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761203731/fmsc-2025/ids/players/sl0sqfcaxpsz2ykqboum.jpg\n11,Anaan ibrahim,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761203827/fmsc-2025/ids/players/r5k8l4fcj5dxtglxzpfn.jpg\n17,Hassan shihubaan,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761203864/fmsc-2025/ids/players/qsao2rvabftjlvv8owld.jpg\n8,Thaaiu abdul hakeem,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761203914/fmsc-2025/ids/players/uumx3jwxuzm4zwtirhlz.jpg\n7,Ahmed raneen,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761204034/fmsc-2025/ids/players/zzfj1ztq3uzpffwfig49.jpg\n6,Ali rishvaan,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761204106/fmsc-2025/ids/players/kdldzfrxavdi118moxcs.jpg\n20,Unaish ibrahim,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761204153/fmsc-2025/ids/players/zbyytm9dglakh2wjlo69.jpg\n10,Hood ahmed fathuhy,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761218817/fmsc-2025/ids/players/rvdj5phjug4spwtm5zil.jpg\n1,Muhammed ahnaf,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761226692/fmsc-2025/ids/players/c3kfbje7lehu72ifcr4j.jpg\n\nOFFICIALS:\nRole,Name,ID_URL\nManager,Adam shimrah,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761226978/fmsc-2025/ids/officials/wuuj98z7x8iztu9hqgm5.jpg\nCoach,Ahmed usam,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761217622/fmsc-2025/ids/officials/yxwojtak2wu77szdqp9f.jpg\nOfficial,Hussain shifaan,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761218151/fmsc-2025/ids/officials/hkrrtnwt87ekngrrkokw.jpg\nOfficial,Mohamed shahudh,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761218398/fmsc-2025/ids/officials/dyjfni0ddzkwxn5gjd6i.jpg\nFirst Aid,Mohamed aiham,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761226746/fmsc-2025/ids/officials/piak6uju7tj72vbliiqb.jpg",
  "teamName": "Maahinna united",
  "timestamp": 1761243168721
};

// Convert to latest format
const convertedData = convertToLatestFormat(maahhinnaData);

// Validate the result
const validationErrors = validateFormat(convertedData);

console.log('=== MAAHINNA UNITED - CONVERTED TO LATEST FORMAT ===\n');
console.log(JSON.stringify(convertedData, null, 2));

if (validationErrors.length > 0) {
    console.log('\n❌ Validation Errors:');
    validationErrors.forEach(error => console.log(`- ${error}`));
} else {
    console.log('\n✅ Format validation passed!');
    console.log(`\n📊 Summary:`);
    console.log(`- Team: ${convertedData.teamName}`);
    console.log(`- Players: ${convertedData.players.length}`);
    console.log(`- Officials: ${convertedData.officials.length}`);
    console.log(`- Goalkeepers: ${convertedData.players.filter(p => p.isGoalkeeper).length}`);
}