const e=React.createElement;

function center(element){
    
    return e('div',
                { style:{textAlign:"center"}},
            element);
}
const product_info=e('div',{
    id:'product_info',
    style:{
        height:"400px",
        width:"1000px",
        textAlign:"center",
        backgroundColor:'green',
        margin:"100px",
        visibility:'hidden'
    }


});
class CustomDropdown extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        selectedValue: 'Products',
        isExpanded: false,
      };
  
      this.handleOptionClick = this.handleOptionClick.bind(this);
      this.handleDropdownToggle = this.handleDropdownToggle.bind(this);
      this.handlepointertouch = this.handlepointertouch.bind(this);
      this.handlepointerout = this.handlepointerout.bind(this);
     
    }
  
    handleOptionClick(event, value) {
      this.setState({
        // selectedValue: value,
        isExpanded: false,
      });
     
      if (value === 'paint_app') {
        window.location.assign('/digit_paint');
      }
      else if(value==='pose_estimation'){
           window.location.assign('/pose_estimation');
      }
    }
    handlepointertouch(event) {
        event.target.style.backgroundColor="red";
        event.target.style.borderRadius="5px";
        event.target.style.border='2px ridge gray';
        let product_info=document.getElementById('product_info');
        product_info.style.visibility='visible';
      
      }
    handlepointerout(event) {
        event.target.style.backgroundColor="gray";
        event.target.style.border=null;
        event.target.style.borderRadius=null;
        let product_info=document.getElementById('product_info');
        product_info.style.visibility='hidden';
       
      }
  
    handleDropdownToggle(event) {
      this.setState({
        isExpanded: !this.state.isExpanded,
      });
    }
  
    render() {
      const options = [
        // { label: 'Products', value: 'Products', disabled: true },
        { label: 'Digit Vision', value: 'paint_app' },
        { label: 'AlignGPT', value: 'pose_estimation' },
        { label: 'Product 3', value: 'product3' },
      ];
  
      const optionsElements = options.map((option) =>
        React.createElement(
          'div',
          {
            id:option.label,
            key: option.value,
            onClick: (event) => this.handleOptionClick(event, option.value),
            onMouseEnter:(event) => this.handlepointertouch(event),
            onMouseLeave:(event) => this.handlepointerout(event),
            style: {
                backgroundColor: 'gray',
                height:"40px",
                padding:"10px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 1.0)",
    

            }
            
          },
          option.label
        )
      );
  
      const dropdownContent = this.state.isExpanded ? optionsElements : null;
  
      return React.createElement(
        'div',
        {
          className: 'custom-dropdown',
          onMouseEnter: this.handleDropdownToggle,
          onClick: this.handleDropdownToggle,
          style: {
            backgroundColor: 'transparent',
            //border: '2px groove gray',
            boxShadow: "0 0 10px rgba(0, 0, 0, 1.0)",
            transition: 'box-shadow 0.4s ease-in-out',
            borderRadius:"10px",
            fontSize: '20px',
            color:'black',
            width: '400px',
            height:'50px',
            fontFamily:'sans-serif',
            display:'inline-flex',
            flexDirection:'column',
            paddingTop:"25px",
            marginDown:"15px"
            
           
          }, 
        },
        this.state.selectedValue,
        dropdownContent
      );
    }
  }
  

class Master extends React.Component {
    render() {
        return e(
            'div',null,
            center(e(CustomDropdown)),
            product_info
           
            );
        }
    }




const root = ReactDOM.createRoot(document.getElementById('products'));
root.render(e(Master));