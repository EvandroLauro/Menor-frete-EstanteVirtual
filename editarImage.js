const Jimp = require('jimp');
const { getPaletteFromURL } = require('color-thief-node');
const fs = require('fs');

async function main() {
    fs.unlinkSync('result.png');
    const img = 'imagem.jpg'
    var obj = {
        direito: 0,
        esquerdo: 0,
        top: 0,
        baixo: 0
    };

    // get position direito
    var posDireito = 1;
    var colorPalleteDireito = [];
    while (true) {
        const image = await Jimp.read(img);
        const h = image.bitmap.height;
        const w = image.bitmap.width;
        image.crop(0, 0, posDireito, h).write('crop.png'); 
        await new Promise(resolve => setTimeout(resolve, 100))
        colorPalleteDireito = await getPaletteFromURL('crop.png');
        if (colorPalleteDireito.length > 1) {
        obj.direito = posDireito; 
        fs.unlinkSync('crop.png');
        break;
        }
        posDireito = posDireito + 1;
        fs.unlinkSync('crop.png');
    }
    
    // get position crop esquerdo
    var posEsquerdo = 1;
    var colorPalleteEsquerdo = [];
    while (true) { 
        const image = await Jimp.read(img);
        const h = image.bitmap.height;
        const w = image.bitmap.width;
        image.crop(1, 0, posEsquerdo, h).write('crop.png');
        await new Promise(resolve => setTimeout(resolve, 100));
        colorPalleteEsquerdo = await getPaletteFromURL('crop.png');
        if (colorPalleteEsquerdo.length > 1) {
        obj.esquerdo = posEsquerdo;
        fs.unlinkSync('crop.png');
        break;
        }
        posEsquerdo = posEsquerdo + 1;
        fs.unlinkSync('crop.png');
    }

    // get position crop top
    var posTop = 1;
    var colorPalleteTop = [];
    while (true) { 
        const image = await Jimp.read(img);
        const h = image.bitmap.height;
        const w = image.bitmap.width;
        image.crop(0, 0, w, posTop).write('crop.png');
        await new Promise(resolve => setTimeout(resolve, 100));
        colorPalleteTop = await getPaletteFromURL('crop.png');
        if (colorPalleteTop.length > 1) {
        obj.top = posTop;
        fs.unlinkSync('crop.png');
        break;
        }
        posTop = posTop + 1;
        fs.unlinkSync('crop.png');
    }

    // get position crop baixo
    var posBaixo = 1;
    var colorPalleteBaixo = [];
    while (true) { 
        const image = await Jimp.read(img);
        const h = image.bitmap.height;
        const w = image.bitmap.width;
        image.crop(0, h - posBaixo, w, h - (h - posBaixo) ).write('crop.png');
        await new Promise(resolve => setTimeout(resolve, 100));
        colorPalleteBaixo = await getPaletteFromURL('crop.png');
        if (colorPalleteBaixo.length > 1) {
        obj.baixo = posBaixo;
        fs.unlinkSync('crop.png');
        break;
        }
        posBaixo = posBaixo + 1;
        fs.unlinkSync('crop.png');
    }
    console.log(obj)
    const image = await Jimp.read(img);
    const h = image.bitmap.height;
    const w = image.bitmap.width;
    image.crop(0, 0, w - obj.direito, h);                                          // corta direito
    image.crop(obj.esquerdo, 0, (w - obj.direito) - obj.esquerdo, h );             // corte esquerdo
    image.crop(0, obj.top, (w - obj.direito) - obj.esquerdo, h);                   // corte top
    image.crop(0, 0, (w - obj.direito) - obj.esquerdo, (h - obj.top) - obj.baixo); // corte baixo
    image.write('result.png');

}
main()
