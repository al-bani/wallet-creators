const { Wallet } = require('ethers');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function writeToFile(filename, data) {
    fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log(`Data successfully written to ${filename}`);
        }
    });
}

function AutoGenerateRandWallet(qtyWallet) {
    const dataArray = [];
    
    for (let i = 0; i < qtyWallet; i++) {
        const wallet = Wallet.createRandom();
        dataArray.push({
            "addr": wallet.address,
            "pk": wallet.privateKey,
            "mnemonic": wallet.mnemonic.phrase
        });
    }
    
    writeToFile('wallet.json', dataArray);

    return `Successfully created ${qtyWallet} wallet(s).`;
}

function AutoGenerateVanityWallet(prefix, qty) {
    const dataArray = [];
    let foundPrefix = 0;
    let attempts = 0;
    const interval = 10000;
    prefix = '0x' + prefix;

    console.log(`Finding the vanity address with ${prefix}...`);

    while (foundPrefix < qty) {
        const wallet = Wallet.createRandom();
        attempts++;

        if (wallet.address.startsWith(prefix)) {
            console.log(`Found address starting with ${prefix} in ${attempts} attempts`);

            dataArray.push({
                "addr": wallet.address,
                "pk": wallet.privateKey,
                "mnemonic": wallet.mnemonic.phrase
            });
            foundPrefix++;
        }

        if (attempts % interval === 0) {
            console.log(`Generated ${attempts} addresses...`);
        }
    }

    writeToFile('wallet.json', dataArray);

    return `Successfully created ${foundPrefix} vanity address(es) starting with ${prefix} in ${attempts} attempts.`;
}

rl.question('1. Auto generate wallet\n2. Auto generate vanity address\nYour choice: ', (choice) => {
    if (choice == 1) {
        rl.question('Input number of wallets: ', (input) => {
            const qtyOfWallet = parseInt(input, 10);
            console.log(AutoGenerateRandWallet(qtyOfWallet));
            rl.close();
        });
    } else if (choice == 2) {
        rl.question('Input your vanity address prefix (e.g., 0x000): 0x', (prefix) => {
            rl.question('Input number of addresses to generate (default is 1): ', (qty) => {
                const qtyOfWallet = parseInt(qty, 10) || 1;
                console.log(AutoGenerateVanityWallet(prefix, qtyOfWallet));
                rl.close();
            });
        });
    } else {
        console.log('Invalid choice.');
        rl.close();
    }
});
