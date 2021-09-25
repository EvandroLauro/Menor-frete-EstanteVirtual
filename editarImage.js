const Jimp = require('jimp');
const { getPaletteFromURL } = require('color-thief-node');
const fs = require('fs');

// Obs: Essa função tem que retornar alguma coisa no futuro
const editarImagem = async() => {
    
    const main = async (image) => {
        const promise = [
            identifyBorder("rigth", image),
            identifyBorder("left", image),
            identifyBorder("top", image),
            identifyBorder("bottom", image)
        ];
        const bordersPostionList = await Promise.all(promise).then((data) => {
                return data;
        });
        const borderPositionsObj = {
            "rigth" : bordersPostionList[0],
            "left" : bordersPostionList[1],
            "top" : bordersPostionList[2],
            "bottom" : bordersPostionList[3]
        };
        await editar(image, borderPositionsObj);
    }

    const identifyBorder = async (lado, image) => {
        var pos = 1;
        var colorPallete = [];
        while (true) {
            try {
                const link = await positionBorder(lado, pos, image);  
                await new Promise(resolve => setTimeout(resolve, 100));
                colorPallete = await getPaletteFromURL(link);
                if (colorPallete.length > 1) {
                    fs.unlinkSync(link);
                    return pos;
                }
                pos = pos + 1;
                fs.unlinkSync(link);
            } catch (error) {
                await identifyBorder(lado, image);
            }
        }
    }

    const positionBorder = async (lado, pos, image) => {
        const img = await Jimp.read(image);
        const h = img.bitmap.height;
        const w = img.bitmap.width;
        switch(lado) {
            case "rigth":
                img.crop(0, 0, pos, h).write('cropRigth.png'); 
                return 'cropRigth.png';
            case "left":
                img.crop(1, 0, pos, h).write('cropLeft.png');
                return 'cropLeft.png';
            case "top":
                img.crop(0, 0, w, pos).write('cropTop.png');
                return 'cropTop.png';
            case "bottom":
                img.crop(0, h - pos, w, h - (h - pos) ).write('cropBotom.png');
                return 'cropBotom.png';
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
