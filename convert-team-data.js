// Script to convert wrong format team data to correct structured format

function convertTeamData(wrongFormatData) {
    const result = {
        submissionDate: wrongFormatData.submissionDate,
        teamName: wrongFormatData.teamName,
        timestamp: wrongFormatData.timestamp,
        players: [],
        officials: []
    };

    // Split the teamList string into sections
    const sections = wrongFormatData.teamList.split('\n\n');
    
    // Process PLAYERS section
    const playersSection = sections.find(section => section.startsWith('PLAYERS:'));
    if (playersSection) {
        const playerLines = playersSection.split('\n').slice(2); // Skip "PLAYERS:" and header line
        
        playerLines.forEach(line => {
            if (line.trim()) {
                const parts = line.split(',');
                if (parts.length >= 3) {
                    const player = {
                        jerseyNumber: parts[0],
                        name: parts[1],
                        position: parts.length > 3 ? parts[2] : null,
                        idImageUrl: parts[parts.length - 1] // Last part is always the URL
                    };
                    
                    // If position is not provided (only 3 parts), set position to null
                    if (parts.length === 3) {
                        player.position = null;
                        player.idImageUrl = parts[2];
                    }
                    
                    result.players.push(player);
                }
            }
        });
    }

    // Process OFFICIALS section
    const officialsSection = sections.find(section => section.startsWith('OFFICIALS:'));
    if (officialsSection) {
        const officialLines = officialsSection.split('\n').slice(2); // Skip "OFFICIALS:" and header line
        
        officialLines.forEach(line => {
            if (line.trim()) {
                const parts = line.split(',');
                if (parts.length >= 3) {
                    const official = {
                        role: parts[0],
                        name: parts[1],
                        idImageUrl: parts[2]
                    };
                    result.officials.push(official);
                }
            }
        });
    }

    return result;
}

// Example usage with the provided wrong format data
const wrongFormatData = {
    "submissionDate": "2025-10-21T10:52:41.853Z",
    "teamList": "PLAYERS:\nJersey,Name,Position,ID_URL\n25,Ifu,GK,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976020/fmsc-2025/ids/players/jvsihfb4rohv9qqmmann.jpg\n11,Naaphew,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976070/fmsc-2025/ids/players/aekiousu1s3rrebuq9im.jpg\n47,vishah,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976105/fmsc-2025/ids/players/eeqarc3bzgjwq72oqppc.jpg\n17,Althaf,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976333/fmsc-2025/ids/players/zqxklft486kckbx5ukhn.jpg\n12,Ayaaz,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976696/fmsc-2025/ids/players/g0rf3tjav7nxbpglsjvk.jpg\n10,Sisaan,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976737/fmsc-2025/ids/players/q5gcf05vhle8qqp8leei.jpg\n7,santtey,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976782/fmsc-2025/ids/players/gxroohkz3ekwxunek44u.jpg\n88,HUSSAIN,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976818/fmsc-2025/ids/players/bvi99h3frc3uvmeruapv.jpg\n9,SAAIDH,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976867/fmsc-2025/ids/players/iiakrq2lxdjpxhzit7mv.jpg\n30,HASSAN DHY,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976898/fmsc-2025/ids/players/ygnixh5b0sdrfrgusdcp.jpg\n5,REDAY,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760977113/fmsc-2025/ids/players/xnmcvks0rdzipfwl780t.jpg\n15,MATA,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761043929/fmsc-2025/ids/players/qo4otuml60lnwsmh6rvz.jpg\n\nOFFICIALS:\nRole,Name,ID_URL\nManager,Ali Jawax,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760977212/fmsc-2025/ids/officials/gpk71v3pbbqhmf3jpbdu.jpg\nCoach,Ali thalfaah,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760977228/fmsc-2025/ids/officials/oxrc8e9imbzfwar9p7uj.jpg\nOfficial,Hussain  nafiu,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760977275/fmsc-2025/ids/officials/lxwbxxvxgerdzozpknbe.jpg\nOfficial,Abdulla  maumoon,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760979360/fmsc-2025/ids/officials/erjeir8cwcdv4m3i8krc.jpg\nFirst Aid,Ali Rasheedh,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760977631/fmsc-2025/ids/officials/iljki5ahfvx8rovtrn3d.jpg",
    "teamName": "Brave  Generation Sports  Club",
    "timestamp": 1761043963151
};

// Convert to correct format
const correctFormat = convertTeamData(wrongFormatData);

// Output the corrected format
console.log('Corrected Format:');
console.log(JSON.stringify(correctFormat, null, 2));

// Export function for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { convertTeamData };
}