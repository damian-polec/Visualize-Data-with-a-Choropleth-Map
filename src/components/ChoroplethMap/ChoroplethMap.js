import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';



class ChoroplethMap extends Component {

    componentDidMount() {
        this.createMap();
    }

    createMap() {
        const height = 680;
        const width = 960
        const svg = d3.select('svg').attr('height', height).attr('width', width);
        const path = d3.geoPath();
        const counties = this.props.geoLoc;
        const domain = d3.extent(this.props.data, d => d.bachelorsOrHigher);
        const tooltip = d3.select('#tooltip').style('opacity', 0);
        const color = d3.scaleQuantile()
            .domain(domain)
            .range(d3.schemeReds[9]);
        //legend
        const scaleX = d3.scaleLinear()
            .domain(d3.extent(color.domain()))
            .rangeRound([600, 860]);

        const axisX = d3.axisBottom(scaleX)
            .tickSize(13)
            .tickValues(color.range().slice(1).map(d => color.invertExtent(d)[0]))

        const g = svg.append('g')
            .attr('transform', 'translate(0, 40)')
            .attr('id', 'legend');
        g.selectAll('rect')
            .data(color.range().map(d => color.invertExtent(d)))
            .enter().append('rect')
            .attr('height', 8)
            .attr('x', d => scaleX(d[0]))
            .attr('width', d => scaleX(d[1]) - scaleX(d[0]))
            .attr('fill', d => color(d[0]));
        
        g.call(axisX);

        const regions = svg.append('g')
            .selectAll('path')
            .data(topojson.feature(counties, counties.objects.counties).features)
            .enter().append('path')
            .attr('class', 'county')
            .attr('data-fips', d => d.id)
            .attr('data-education', d => {
                const index = this.props.data.findIndex(obj => d.id === obj.fips)
                return this.props.data[index].bachelorsOrHigher;
            })
            .attr('fill', d => {
                const index = this.props.data.findIndex(obj => d.id === obj.fips)
                return color(this.props.data[index].bachelorsOrHigher);
            })
            .attr('d', path)
        regions.on('mouseover', d => {
            const index = this.props.data.findIndex(obj => d.id === obj.fips)
            tooltip.transition()
                .duration(100)
                .style('opacity', .9);
            tooltip.html(
                '<p>'+this.props.data[index].area_name +', ' + this.props.data[index].state + '</p>'
                +'<p>' + this.props.data[index].bachelorsOrHigher + '%</p>'
            )
            .attr('data-education', this.props.data[index].bachelorsOrHigher)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY) + 'px')
        })
        .on('mouseout', d => {
            tooltip.transition()
                .duration(100)
                .style('opacity', 0);
        })
    }
    render() {
        return (
        <div id='map'>
            <svg></svg>
            <div id='tooltip'></div>
        </div>
        )
    }
}

export default ChoroplethMap;