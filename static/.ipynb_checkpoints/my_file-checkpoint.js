/*  @author: Anirban Chowdhury
    @copyright(c): Anirban Chowdhury
*/



const e = React.createElement;
function canvas(){
    const canvas_obj=e('canvas',{ 
                        id:"paint_canv",
                        width:"500", 
                        height:"500",
                        onMouseMove:canvas_draw,
                        onDoubleClick:toggle_draw,
                        style:{
                                border:"20px ridge green",
                                borderRadius:"20px",
                                background:"black",

                                }
                            }
                    );
    return canvas_obj;

}


let c=1;
function center(element){
        c=c+1;
        return e('h'+String.fromCharCode('0'.charCodeAt(0)+c),
                    { style:{textAlign:"center",font_family:"lobster,cursive",font_size:"20"}},
                element);
}


let button_style={
    backgroundColor: 'transparent',
    border: '2px solid black',
    borderRadius:"10px",
    fontSize: '22px',
    color:'black',
    width: '100px',
    height:'30px',
    fontFamily:'sans-serif',
    display:'inline-flex',
    margin:"10px"
};

const colorbar=e('label',null,'Color ',e('input', {type:"color",onChange:set_paint_color}));
const brush_width=e('label',null,' Brush-width ',
                    e('input', {id:"brush_width ",type:"range",min:"20",max:"40",onChange:set_brush_size})
                    );
let test_model_server=e('button',{style:button_style},'TEST MODEL SERVER');
test_model_server.props.style.margin='auto';
test_model_server.props.style.marginLeft='20px';
test_model_server.props.style.marginTop='10px';
test_model_server.props.style.height='40px';
test_model_server.props.style.fontSize='13px';
test_model_server.props.onMouseEnter=function mousEenter(e){e.target.style.backgroundColor='#f5ee24';},
test_model_server.props.onMouseLeave=function mouseLeave(e){e.target.style.backgroundColor='transparent';}
test_model_server.props.onClick=function test_model(e){
    fetch("https://darknet.loca.lt/v1/models/digit_model",
                    {method:'GET',
                    
                    headers: { 'Content-Type': 'application/json' }
                    }).then(response => {
                        response.json().then(result=>{
                            let canv=document.getElementById('paint_canv')
                            context=canv.getContext('2d');
                            context.fillStyle='white';
                            context.font="20px arial";
                            //console.log(result);
                            let start=30;
                            const data=result['model_version_status'][0];
                            const version=data['version'];
                            context.fillText('version: '+version,30,start);
                            const state=data['state'];
                            start+=30;
                            context.fillText('state: '+state,30,start);
                            const error_code=data['status']['error_code'];
                            start+=30;
                            context.fillText('error_code: '+error_code,30,start);
                            const error_message=data['status']['error_message'];
                            start+=30;
                            context.fillText('error_message: '+error_message,30,start);


                            // context.fillText(JSON.stringify(result),30,30);

                        });
                        
                        });
                   

}
const Drawing_mode_label=e('label',{id:'draw_label',style:{all:"unset",fontSize:"40px"}},"Drawing OFF");

const style=e('style',{background_color:"red"})
const menu=e('div',
            {   id:'menu',
                onMouseEnter:function highlt_menu(e){
                    if  (e.target.id=='menu')
                        e.target.style.boxShadow="0 0 40px rgba(255, 0, 0, 1.0)";
                },
                onMouseLeave:function unhighlt_menu(e){
                    if  (e.target.id=='menu')
                        e.target.style.boxShadow="0 0 20px rgba(255, 0, 0, 1.0)";
                },
                style:{
                font_family:"lobster,cursive",
                textAlign:"center",
                backgroundColor:"transparent",
                //border:"4px solid red",
                borderRadius:"20px",
                width:"500px",
                height:"100px",
                margin:"auto",
                wordSpacing:"10px",
                boxShadow: "0 0 20px rgba(255, 0, 0, 1.0)",
                transition: 'box-shadow 0.4s ease-in-out',
                }
            },
            colorbar,
            brush_width,
            test_model_server,
            Drawing_mode_label);
function set_paint_color(e){
    let canv=document.getElementById('paint_canv')
    context=canv.getContext('2d');
    context.strokeStyle=e.target.value;
    canv.style.borderColor=e.target.value;
    //console.log("value changed",e.target.value);
}
function set_brush_size(e){
    context=document.getElementById('paint_canv').getContext('2d');
    context.lineWidth=e.target.value;
    //console.log("value changed",e.target.value);
}
function clear_canvas(ex){
    context=document.getElementById('paint_canv').getContext('2d');
    context.clearRect(0,0,500,500);
    context.closePath();
    draw=0;
    draw_label=document.getElementById('draw_label');
    draw_label.textContent="Drawing OFF";
}
let draw=0;

function toggle_draw(ex){
    draw_label=document.getElementById('draw_label');
    context=document.getElementById('paint_canv').getContext('2d');
    if(!draw){
        context.lineCap="round";
        context.lineJoin="round";
        context.beginPath();
        context.willReadFrequently=1;
        context.moveTo(ex.nativeEvent.offsetX,ex.nativeEvent.offsetY);
        draw_label.textContent="Drawing ON";
        draw=1;
    }
    else{
        context.closePath();
        draw=0;
        draw_label.textContent="Drawing OFF";

    }

}

function canvas_draw(ex){

    let context=ex.target.getContext('2d');
    
    if(draw){
        context.lineTo(ex.nativeEvent.offsetX,ex.nativeEvent.offsetY);
        context.stroke();}
   
}

let op=0;
function button_click(ex){
    
    //ex.preventDefault();
    let context=document.getElementById('paint_canv').getContext('2d');
    let data=context.getImageData(0,0,500,500,{colorspace:"srgb"}).data;  
    data=Array.from(data)
    data=tf.tensor1d(data).reshape([500,500,4]);
    data=data.slice([0,0,0],[500,500,3]);
    
    
    data=data.mean(2, true);
    data=tf.layers.resizing({height:28,width:28,input_shape:[500,500,1]}).apply(data);
    data=tf.cast(data,'int32');
    
    data={"instances":data.arraySync()};
    

    fetch("https://darknet.loca.lt/v1/models/digit_model:predict",
                    {method:'POST',
                    body:JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' }
                    }).then(response => {
                        //console.log(response);
                        response.json().then(result=>{
                            //console.log(result.predictions);
                            const res=tf.argMax(result.predictions,1).arraySync()[0];
                           
                            const op=document.getElementById('output');
                            //console.log((tf.max(result.predictions,1).arraySync[0]));
                            let confidence=(tf.max(result.predictions,1).arraySync()[0])*100;
                            op.textContent='The Digit is '+res+'  ('+confidence.toFixed(3)+'%)';
                        });
                    });
  
    
}

const send_data=e('div',null,
                        e('input',{type:"button",style:button_style,onClick:button_click,
                        onMouseEnter:function mouseenter(e){e.target.style.backgroundColor='#90DFF9';},
                        onMouseLeave:function mouseleave(e){e.target.style.backgroundColor='transparent';},value:"    PREDICT"}),
                        e('input', {type:"button",style:button_style,id:"clear",value:"     CLEAR",onClick:clear_canvas})
                );

const output=e('p',{id:"output" ,style:{textAlign:"center",fontSize:"40px",color:"red",font_family:"lobster,cursive"}},
                'The Digit is ',op);
class PaintCanvas extends React.Component {
    render() {
        return e(
            'div',null,
            menu,
            center(canvas()),
            center(send_data),
            output
           
            );
        }
    }


const root = ReactDOM.createRoot(document.getElementById('paint'));

root.render(e(PaintCanvas));

