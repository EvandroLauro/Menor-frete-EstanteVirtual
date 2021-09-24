const Jimp = require('jimp');
const { getPaletteFromURL } = require('color-thief-node');
const fs = require('fs');

const editarImagem = async() => {
    
    const main = async (image) => {
        const position = {
            rigth: 0,
            left: 0,
            top: 0,
            bottom: 0
        }
        // Quero colocar isso em uma promessa.all
        position.rigth = await identifyBorder("rigth", image);  //direito
        position.left = await identifyBorder("left", image);    //esquero 
        position.top = await identifyBorder("top", image);      //topo
        position.bottom = await identifyBorder("bottom", image);//fundo
        await editar(image,position)
    }

    const identifyBorder = async (lado, image) => {
        var pos = 1;
        var colorPallete = [];
        while (true) { // Quero colocar esse bloco em no try
            await positionBorder(lado, pos, image);  
            await new Promise(resolve => setTimeout(resolve, 100));
            colorPallete = await getPaletteFromURL('crop.png');
            if (colorPallete.length > 1) {
                fs.unlinkSync('crop.png');
                return pos;
            }
            pos = pos + 1;
            fs.unlinkSync('crop.png');
        }
    }

    const positionBorder = async (lado, pos, image) => {
        const img = await Jimp.read(image);
        const h = img.bitmap.height;
        const w = img.bitmap.width;
        switch(lado) {
            case "rigth": // direito
                img.crop(0, 0, pos, h).write('crop.png'); 
                break;
            case "left":
                img.crop(1, 0, pos, h).write('crop.png');
                break;
            case "top":
                img.crop(0, 0, w, pos).write('crop.png');
                break;
            case "bottom":
                img.crop(0, h - pos, w, h - (h - pos) ).write('crop.png');
                break;
        }
    }

    const editar = async (image, position) => {
        const img = await Jimp.read(image);
        const h = img.bitmap.height;
        const w = img.bitmap.width;
        img.crop(0, 0, w - position.rigth, h);                                                       // corta direito
        img.crop(position.left, 0, (w - position.rigth) - position.left, h );                        // corte esquerdo
        img.crop(0, position.top, (w - position.rigth) -  position.left, h);                         // corte topo
        img.crop(0, 0, (w - position.rigth) -  position.left, (h - position.top) - position.bottom); // corte baixo
        img.write('result.png');
    }

    return { 
        start(image) {
            return main(image);
        }
    };
}

async function executar() {
    const image = 'imagem.jpg';
    const editar = await editarImagem()
    await editar.start(image)
}
executar()
