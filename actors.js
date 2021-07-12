class Enemy{
    constructor(mesh,planet,target,DEBUG=true,scene){
        this.mesh=mesh

        this.enemy=null
        this.pivot=null

        this.planet=planet

        //move toward target
        this.target=target
        

        //movement
        this.nextEnemyMoveTime=new Date().getTime();

        //distance to move before stopping
        this.maxdistanceMoved=Math.PI/4

        //how much to move per frame
        this.velocity=Math.PI/200

        //how much to wait before moving again, if 0 continue movement
        this.moveInterval=500 //ms

        //distance traveled in this step
        this.distanceStepMoved=0

        this.direction=1

        // how many times it was hit by a bullet
        this.numHits = 0;

        // to change its color when hit
        this.mesh.material = new BABYLON.StandardMaterial("matEnemy", scene);
        this.mesh.material.diffuse = new BABYLON.Color3(1, 1, 1);
    }

    spawn(position=new BABYLON.Vector3(0,0,0)){
        console.log("creating enemy at: "+position)
        //time used for naming
        const currentTime = new Date().getTime();

        this.enemy=this.mesh.createInstance()
        this.enemy.position=position;
        if(DEBUG) this.enemyPivot = BABYLON.Mesh.CreateCapsule(`enemyPivot`, { radiusTop: 0.05 }, scene);
        else this.enemyPivot=new BABYLON.TransformNode(`${currentTime}enemyPivot`)

        //rotate pivot towards player w.r.t enemy position
        rotateTowards(this.enemyPivot,this.enemy,this.target)
        
        //orient enemy so that it's on surface along normal
        orientSurface(this.enemy,position,this.planet)

        this.enemy.setParent(this.enemyPivot)
        this.enemyPivot.setParent(this.planet)

        if(position.x>0) this.direction=-1
      
        this.enemy.checkCollisions = true;
        this.enemy.showBoundingBox = true;
    }

    moveStep(){
        //move of some distance and wait MoveInterval
        //if moveInterval is set to 0, the movement is continous
        const currentTime = new Date().getTime();

        //compute how to rotate pivot
        var forward = new BABYLON.Vector3(0, 0, 1);		
        var direction = this.enemyPivot.getDirection(forward);
        direction.normalize();

        var dir=this.direction
        
        //var dir=1
        if (this.distanceStepMoved<this.maxdistanceMoved && currentTime>this.nextEnemyMoveTime) {
            //move of velocity
            
            
            this.enemyPivot.rotate(direction,this.velocity*dir, BABYLON.Space.WORLD);
            this.distanceStepMoved+=this.velocity
        }
        else if(this.distanceStepMoved>0){
            //stop moving and wait
            //console.log(dir)
            this.nextEnemyMoveTime = new Date().getTime() + this.moveInterval;
            this.distanceStepMoved=0    
        }
    }

    updatePosition(){
        console.log("changing direction")
        //every step it should update the direction
        this.enemyPivot.setParent(null)
        this.enemy.setParent(null)
       
        this.enemyPivot.rotation = BABYLON.Vector3.Zero()
        //da fare animato magari
        
        rotateTowards(this.enemyPivot,this.enemy,this.target)

        if(this.enemy.getAbsolutePosition().x>0) this.direction=-1
        else this.direction=1

        this.enemy.setParent(this.enemyPivot)
        this.enemyPivot.setParent(this.planet)
    }


    // If the enemy is hit once it becomes red, when it's hit the second
    // time it disappears
    whenHit() {
        this.numHits += 1;
        if (this.numHits > 1) {
            this.enemy.dispose();
            return 1;
        }
        else {
            this.mesh.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
            return 0;
        }
    }
  
}
//serve la classe proiettile?
/*
class Bullet{
    constructor(mesh,planet,target){
        this.mesh=mesh

        this.bullet=null
        this.pivot=null

        
    }
}
*/