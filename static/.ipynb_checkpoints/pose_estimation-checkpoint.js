

//An example of ES6 class to replace typical functional approach to make dynamic elements
// class custom_button extends React.Component{
//     constructor(props){
//         super(props);
//         this.state={click_count:0,text:'click me ',id:'button1'};
//         this.button_click=this.button_click.bind(this);
        
//     }
//     button_click(){
//        this.setState({
//            click_count:this.state.click_count+1,
//            text:'click me '+this.state.click_count
//        });
    
//     }
//     render(){
//         return e('button',{id:this.id,onClick:this.button_click},this.state.text);
//     }
    
    
// }


// root.render(e(custom_button));

const e=React.createElement;

const root = ReactDOM.createRoot(document.getElementById('pose_estimation'));
class angle_banner extends React.Component{
    constructor(props){
        super(props);
        
    
    }
    
    
    render(){
        return e('div',{
        
        style: {
                backgroundColor: 'transparent',
                height:"60px",
                width:"500px",
                padding:"10px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 1.0)",
                margin:'auto',
                marginTop:'20px',
                borderRadius:"20px",
                fontSize:"35px",
                textAlign:"center"
            }
        
        },
        e('font',{color:"red"},'X:   '+this.props.angles[0].toFixed(3)),
        e('font',{color:"blue"},'      Y:   '+this.props.angles[1].toFixed(3)),
        e('font',{color:"green"},'      Z:   '+this.props.angles[2].toFixed(3))
                );
    }


};


class STLViewer extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state={'x':0,'y':0,'z':0};
    
    console.log(this.model);
    
  }

  componentDidMount() {
    console.log(this.canvasRef)
    const canvas = this.canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 5, BABYLON.Vector3.Zero(), scene);
    const toDegr=BABYLON.Tools.ToDegrees
    
// Attach the camera to the canvas
    camera.attachControl(canvas, true);
      camera.alpha = -Math.PI / 2; // Rotate 90 degrees to the left
      camera.beta = Math.PI / 2; // Rotate 90 degrees upwards

      camera.inputs.clear();

    const loadModel = async () => {
      const loader = await BABYLON.SceneLoader.ImportMeshAsync('', this.props.stlFilePath, '', scene);
      const mesh = loader.meshes[0];
      const model=await tf.loadLayersModel('/static/model.json');
      console.log(model);
      mesh.autoUpdateMesh = true;
      const material = new BABYLON.StandardMaterial('material', scene);
      material.diffuseColor = new BABYLON.Color3(0, 1, 0);
      mesh.material = material;
      mesh.id='monkey';
      const original_vertex=BABYLON.VertexData.ExtractFromMesh(mesh).clone();
     console.log(scene);
     
        let isDragging = false;
        let previousMousePosition;

        canvas.addEventListener('pointerdown', (event) => {
          isDragging = true;
          previousMousePosition = {
            x: event.clientX,
            y: event.clientY
          };
           
        });

        canvas.addEventListener('pointerup', () => {
             isDragging = false;
          
              var vertexData = BABYLON.VertexData.ExtractFromMesh(mesh);
              var positions = vertexData.positions;
            console.log(positions);
             console.log(mesh.rotationQuaternion);
              // Apply the rotation quaternion to each vertex position
              for (let i = 0; i < positions.length; i += 3) {
                var vertex = new BABYLON.Vector3(positions[i], positions[i + 1], positions[i + 2]);
                vertex = BABYLON.Vector3.TransformCoordinates(vertex, mesh.getWorldMatrix());
                positions[i] = vertex.x;
                positions[i + 1] = vertex.y;
                positions[i + 2] = vertex.z;
              }

              vertexData.positions = positions;
              //vertexData.applyToMesh(mesh);
              console.log(mesh.rotationQuaternion);
            let data=tf.tensor1d(positions).reshape([1,-1,3]);
            let quat=model.predict(data)
            quat.print()
            quat=quat.arraySync()[0];
            //console.log(quat);
            let quaternion = new BABYLON.Quaternion();
            quaternion=mesh.rotationQuaternion.conjugate();
            vertexData.applyToMesh(mesh);
            // Assign the new rotation quaternion to the mesh
            mesh.rotationQuaternion.copyFrom(quaternion);
            original_vertex.applyToMesh(mesh,true);
            mesh.rotationQuaternion.copyFrom(new BABYLON.Quaternion());
          

           var euler = new BABYLON.Vector3();

            // Convert the rotation quaternion to Euler angles
            mesh.rotationQuaternion.toEulerAnglesToRef(euler);
            

            // Update the state with the Euler angles
            this.setState({ 'x':toDegr( euler.x), 'y': toDegr(euler.y), 'z': toDegr(euler.z) });
            

        });
        
        function normalizeAngle(angle) {
          while (angle < -Math.PI) {
            angle += 2 * Math.PI;
          }
          while (angle > Math.PI) {
            angle -= 2 * Math.PI;
          }
          return angle;
        }


        canvas.addEventListener('pointermove', (event) => {
          if (!isDragging) return;

          const currentPosition = {
            x: event.clientX,
            y: event.clientY
          };

          const delta = {
            x: currentPosition.x - previousMousePosition.x,
            y: currentPosition.y - previousMousePosition.y
          };

          // Update the mesh rotation based on the mouse movement
          let rotationX = delta.x * 0.01;
          let rotationY = delta.y * 0.01;
          let rotationZ = (delta.x + delta.y) * 0.01; // Rotate around the Z-axis
          // mesh.rotation.x=normalizeAngle(mesh.rotation.x);
          // mesh.rotation.y=normalizeAngle(mesh.rotation.y);
          // mesh.rotation.z=normalizeAngle(mesh.rotation.z);
          mesh.rotate(BABYLON.Axis.X, rotationX, BABYLON.Space.LOCAL);
          mesh.rotate(BABYLON.Axis.Y, rotationY, BABYLON.Space.LOCAL);
          mesh.rotate(BABYLON.Axis.Z, rotationZ, BABYLON.Space.LOCAL);
          previousMousePosition = currentPosition;
          
          //we will apply this while applying transofrmation
          //mesh.position.x+=delta.x*0.01;
         
        });

     

      // Enable lighting in the scene
      const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 1), scene);
      // Access the vertices of the mesh
      let vertexData = BABYLON.VertexData.ExtractFromGeometry(mesh.geometry);
      vertexData=vertexData.applyToMesh(mesh,true);
      let positions = vertexData.positions;
      this.setState({'mesh':mesh ,'scene':scene});
      console.log('Vertices:', positions);
      mesh.rotate(BABYLON.Axis.X, 0, BABYLON.Space.LOCAL);
       mesh.rotate(BABYLON.Axis.Y, 0, BABYLON.Space.LOCAL);
       mesh.rotate(BABYLON.Axis.Z, 0, BABYLON.Space.LOCAL);
    }

    loadModel();

    engine.runRenderLoop(() => {
    
      if(this.state.scene)this.state.scene.render();
      
    });
  
    }
  componentWillUnmount() {
    if (this.engine) {
      this.engine.dispose();
    }
  }

  render() {
    return e('div',null,e('canvas', { ref: this.canvasRef ,height:500 ,width:500,style:{
                                border:"20px ridge green",
                                borderRadius:"20px",
                                background:"black",
                                margin:"auto",
                                display:"flex"
                                } }),
        e(angle_banner,{angles:[this.state.x,this.state.y,this.state.z]})
            );
  }
}



class App extends React.Component {

  render() {
    console.log(this);
    return e('div', null,
      e('h1', null),
      e(STLViewer, { stlFilePath: '/static/graphics.stl' }),
     
    );
  }
}
root.render(e(App));



