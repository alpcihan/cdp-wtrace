let data = {
    type: "NewScene",
    objects: [
        {
            /*
            modelName: "xyz_dragon.obj",
            transform: {
                positions: { x: 0, y: 0, z: 0 },
                eulerAngles: { x: 0, y: 0, z: 0 },
                scale: { x: 0.025, y: 0.025, z: 0.025 }
            },*/
            
            modelName: "body.obj",
            transform: {
                positions: { x: 0, y: 0, z: 0 },
                eulerAngles: { x: 0, y: 0, z: 0 },
                scale: { x: 100, y: 100, z: 100 }
            },
            modelName: "head.obj",
            transform: {
                positions: { x: 0, y: 0, z: 0 },
                eulerAngles: { x: 0, y: 0, z: 0 },
                scale: { x: 100, y: 100, z: 100 }
            }
        }
    ]
}

module.exports = {
    data
}