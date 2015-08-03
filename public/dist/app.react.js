var target = document.getElementById('main-body');
var Hello = React.createClass({
  render: function(){
    return <h1>{this.props.text}</h1>;
  } 
});

React.render(<Hello text='hi, finally start to go.' />, target);
//React.render(React.createComponent(app, null), mount_target);