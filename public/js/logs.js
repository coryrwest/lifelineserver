var LogData = React.createClass({
    loadData: function() {
    $.ajax({
        url: "/data/log?view=byDate&start=" + moment().subtract(30, 'days').format('YYYY-MM-DD'),
        dataType: 'json',
        success: function(data) {
            this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(status, err.toString());
        }.bind(this)
    });
},
getInitialState: function() {
    return {data: []};
},
componentDidMount: function() {
    this.loadData();
},
componentDidUpdate: function() {
},
render: function() {
    var logItems = this.state.data.map(function(log) {
        return (
            <tr>
                <td>{log.message}</td>
                <td>{log.date}</td>
                <td>{log.time}</td>
                <td>{log.level}</td>
            </tr>
        )
    });
    return (
        <table class="table table-striped">
            <tbody>
            {logItems}
            </tbody>
        </table>
    );
}
});

React.render(<LogData/>, document.getElementById('logs'));
