// Enhanced script to convert team data to the latest correct format

function convertToLatestFormat(data) {
    // Check if data is already in the latest format
    if (data.isUpdate !== undefined && data.players && Array.isArray(data.players) && 
        data.players.length > 0 && data.players[0].hasIdCard !== undefined) {
        console.log('Data is already in the latest format');
        return data;
    }

    let result = {
        isUpdate: true,
        submissionDate: data.submissionDate,
        teamName: data.teamName.replace(/\s+/g, ' ').trim(), // Clean up extra spaces
        timestamp: data.timestamp,
        updatedDate: new Date().toISOString(),
        players: [],
        officials: []
    };

    // Handle old CSV string format
    if (data.teamList && typeof data.teamList === 'string') {
        const sections = data.teamList.split('\n\n');
        
        // Process PLAYERS section
        const playersSection = sections.find(section => section.startsWith('PLAYERS:'));
        if (playersSection) {
            const playerLines = playersSection.split('\n').slice(2);
            
            playerLines.forEach((line, index) => {
                if (line.trim()) {
                    const parts = line.split(',');
                    if (parts.length >= 3) {
                        const player = {
                            hasIdCard: true,
                            idCardUrl: parts[parts.length - 1], // Last part is always the URL
                            isGoalkeeper: parts.length > 3 && parts[2].toUpperCase() === 'GK',
                            jerseyNumber: parts[0],
                            name: parts[1],
                            position: index + 1
                        };
                        result.players.push(player);
                    }
                }
            });
        }

        // Process OFFICIALS section
        const officialsSection = sections.find(section => section.startsWith('OFFICIALS:'));
        if (officialsSection) {
            const officialLines = officialsSection.split('\n').slice(2);
            
            officialLines.forEach(line => {
                if (line.trim()) {
                    const parts = line.split(',');
                    if (parts.length >= 3) {
                        const official = {
                            hasIdCard: true,
                            idCardUrl: parts[2],
                            name: parts[1],
                            position: parts[0]
                        };
                        result.officials.push(official);
                    }
                }
            });
        }
    }
    // Handle intermediate format (already structured but missing new fields)
    else if (data.players && Array.isArray(data.players)) {
        result.players = data.players.map((player, index) => ({
            hasIdCard: true,
            idCardUrl: player.idImageUrl || player.idCardUrl,
            isGoalkeeper: player.position === 'GK' || player.isGoalkeeper || false,
            jerseyNumber: player.jerseyNumber,
            name: player.name,
            position: index + 1
        }));

        result.officials = data.officials.map(official => ({
            hasIdCard: true,
            idCardUrl: official.idImageUrl || official.idCardUrl,
            name: official.name,
            position: official.role || official.position
        }));
    }

    return result;
}

// Function to validate the format
function validateFormat(data) {
    const errors = [];
    
    if (!data.isUpdate) errors.push('Missing isUpdate field');
    if (!data.submissionDate) errors.push('Missing submissionDate');
    if (!data.teamName) errors.push('Missing teamName');
    if (!data.timestamp) errors.push('Missing timestamp');
    if (!data.updatedDate) errors.push('Missing updatedDate');
    
    if (!Array.isArray(data.players)) {
        errors.push('Players must be an array');
    } else {
        data.players.forEach((player, index) => {
            if (!player.hasIdCard === undefined) errors.push(`Player ${index}: Missing hasIdCard`);
            if (!player.idCardUrl) errors.push(`Player ${index}: Missing idCardUrl`);
            if (player.isGoalkeeper === undefined) errors.push(`Player ${index}: Missing isGoalkeeper`);
            if (!player.jerseyNumber) errors.push(`Player ${index}: Missing jerseyNumber`);
            if (!player.name) errors.push(`Player ${index}: Missing name`);
            if (!player.position) errors.push(`Player ${index}: Missing position`);
        });
    }
    
    if (!Array.isArray(data.officials)) {
        errors.push('Officials must be an array');
    } else {
        data.officials.forEach((official, index) => {
            if (official.hasIdCard === undefined) errors.push(`Official ${index}: Missing hasIdCard`);
            if (!official.idCardUrl) errors.push(`Official ${index}: Missing idCardUrl`);
            if (!official.name) errors.push(`Official ${index}: Missing name`);
            if (!official.position) errors.push(`Official ${index}: Missing position`);
        });
    }
    
    return errors;
}

// Example usage with the old format
const oldFormatData = {
    "submissionDate": "2025-10-21T10:52:41.853Z",
    "teamList": "PLAYERS:\nJersey,Name,Position,ID_URL\n25,Ifu,GK,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976020/fmsc-2025/ids/players/jvsihfb4rohv9qqmmann.jpg\n11,Naaphew,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976070/fmsc-2025/ids/players/aekiousu1s3rrebuq9im.jpg\n47,vishah,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976105/fmsc-2025/ids/players/eeqarc3bzgjwq72oqppc.jpg\n17,Althaf,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976333/fmsc-2025/ids/players/zqxklft486kckbx5ukhn.jpg\n12,Ayaaz,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976696/fmsc-2025/ids/players/g0rf3tjav7nxbpglsjvk.jpg\n10,Sisaan,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976737/fmsc-2025/ids/players/q5gcf05vhle8qqp8leei.jpg\n7,santtey,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976782/fmsc-2025/ids/players/gxroohkz3ekwxunek44u.jpg\n88,HUSSAIN,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976818/fmsc-2025/ids/players/bvi99h3frc3uvmeruapv.jpg\n9,SAAIDH,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976867/fmsc-2025/ids/players/iiakrq2lxdjpxhzit7mv.jpg\n30,HASSAN DHY,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760976898/fmsc-2025/ids/players/ygnixh5b0sdrfrgusdcp.jpg\n5,REDAY,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760977113/fmsc-2025/ids/players/xnmcvks0rdzipfwl780t.jpg\n15,MATA,https://res.cloudinary.com/dgvde8x6e/image/upload/v1761043929/fmsc-2025/ids/players/qo4otuml60lnwsmh6rvz.jpg\n\nOFFICIALS:\nRole,Name,ID_URL\nManager,Ali Jawax,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760977212/fmsc-2025/ids/officials/gpk71v3pbbqhmf3jpbdu.jpg\nCoach,Ali thalfaah,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760977228/fmsc-2025/ids/officials/oxrc8e9imbzfwar9p7uj.jpg\nOfficial,Hussain  nafiu,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760977275/fmsc-2025/ids/officials/lxwbxxvxgerdzozpknbe.jpg\nOfficial,Abdulla  maumoon,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760979360/fmsc-2025/ids/officials/erjeir8cwcdv4m3i8krc.jpg\nFirst Aid,Ali Rasheedh,https://res.cloudinary.com/dgvde8x6e/image/upload/v1760977631/fmsc-2025/ids/officials/iljki5ahfvx8rovtrn3d.jpg",
    "teamName": "Brave  Generation Sports  Club",
    "timestamp": 1761043963151
};

// Convert to latest format
const latestFormat = convertToLatestFormat(oldFormatData);

// Validate the result
const validationErrors = validateFormat(latestFormat);

console.log('Converted to Latest Format:');
console.log(JSON.stringify(latestFormat, null, 2));

if (validationErrors.length > 0) {
    console.log('\nValidation Errors:');
    validationErrors.forEach(error => console.log(`- ${error}`));
} else {
    console.log('\n✅ Format validation passed!');
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { convertToLatestFormat, validateFormat };
}