var L = require('leaflet');
var Handlebars = require('handlebars');
var _ = require('underscore');
var Spinner = require('spin.js');

require('leaflet-draw');
require('livinglots.parcels');

var templates = require('./templates')(Handlebars);

var parcelDefaultStyle = {
    color: '#2593c6',
    fillOpacity: 0,
    weight: 2.5
};

var parcelSelectStyle = {
    fillColor: '#EEC619',
    fillOpacity: 0.5
};

var cancelButtonSelector = '.add-lot-mode-cancel',
    drawButtonSelector = '.add-lot-mode-draw',
    submitButtonSelector = '.add-lot-mode-submit';

var drawControlVisible = false,
    drawControlOptions = {
        position: 'topright',
        draw: {
            circle: false,
            marker: false,
            polygon: {
                allowIntersection: false,
                drawError: {
                    color: '#e1e100',
                    message: 'This would not be a valid shape!'
                },
                shapeOptions: {
                    color: '#1f9e48',
                    opacity: 0.8
                }
            },
            polyline: false,
            rectangle: false
        }
    };


L.Map.include({

    selectedParcels: [],

    parcelLayerOptions: {

        onEachFeature: function (feature, layer) {
            layer.on({
                'click': function (event) {
                    var map = this._map,
                        layer = event.layer,
                        feature = event.target.feature;
                    if (_.findWhere(map.selectedParcels, { id: feature.id })) {
                        map.selectedParcels = _.reject(map.selectedParcels, function (p) {
                            return p.id === feature.id;
                        });
                        layer.setStyle(parcelDefaultStyle);
                    }
                    else {
                        $.get(Django.url('lots:create_by_parcels_check_parcel', { pk: feature.id }))
                            .success(function(data) {
                                if (data !== 'None') {
                                    map.createLotExistsPopup(event.latlng, data);
                                }
                            });
                        map.selectedParcels.push({
                            id: feature.id,
                            address: feature.properties.address
                        });
                        layer.setStyle(parcelSelectStyle);
                    }
                    map.updateLotAddWindow();
                },

                'mouseover': function (event) {
                    var layer = event.layer,
                        feature = event.target.feature;
                    $('.map-add-lot-current-parcel').text(feature.properties.address);
                }
            });
        },

        style: function (feature) {
            return parcelDefaultStyle;
        },

    },

    enterDrawLotMode: function () {
        if (drawControlVisible) { return; }
        if (this._drawControl) {
            this.addControl(this._drawControl);
            this.addLayer(this._drawnLots);
            drawControlVisible = true;
            return;
        }

        drawControlOptions.edit = {
            featureGroup: this._drawnLots
        };
        this._drawControl = new L.Control.Draw(drawControlOptions);
        this.addControl(this._drawControl);
        drawControlVisible = true;
    },

    removeDrawControl: function () {
        if (!drawControlVisible) { return; }
        drawControlVisible = false;
        this.removeControl(this._drawControl);
        this.removeLayer(this._drawnLots);
    },

    enterLotAddMode: function () {
        var map = this;
        this.addParcelsLayer();
        this._drawnLots = L.featureGroup().addTo(this);
        this.updateLotAddWindow();
        this.fire('entermode', { name: 'addlot' });
        this.lotAddZoomHandler();

        $(this.options.addLotParent).addClass('on');
    },

    lotAddZoomHandler: function () {
        if (this.getZoom() < 16) {
            $('.map-add-lot-zoom-message').show();
        }
        else {
            $('.map-add-lot-zoom-message').hide();
        }
    },

    createLotExistsPopup: function (latlng, pk) {
        var url = Django.url('lots:lot_detail', { pk: pk }),
            content = templates['existspopup.hbs']({ lotUrl: url });
        this.openPopup(content, latlng, { offset: [0, 0] });
    },

    replaceLotAddWindowContent: function (content) {
        $('.map-add-lot-mode-container').remove();
        $(this.options.addLotParent).append(content);
        this.fire('lotaddwindowchange');
    },

    submitLotAdd: function () {
        var parcelPks = _.pluck(this.selectedParcels, 'id'),
            spinner = new Spinner().spin($('.map-add-lot-mode-container')[0]),
            args = {
                csrfmiddlewaretoken: Django.csrf_token(),
            },
            map = this,
            url = null;

        if (parcelPks.length > 0 && confirm('Create one lot with all of the parcels selected?')) {
            args.pks = parcelPks.join(',');
            url = Django.url('lots:create_by_parcels');
        }
        else if (this._drawnLots.getLayers().length > 0 && confirm("Create one lot with the parcels you've drawn?")) {
            args.geom = JSON.stringify(this._drawnLots.toGeoJSON());
            url = Django.url('lots:create_by_geom');
        }

        if (url) {
            $(cancelButtonSelector).addClass('disabled');
            $(drawButtonSelector).addClass('disabled');
            $(submitButtonSelector).addClass('disabled');

            $.post(url, args)
                .always(function () {
                    spinner.stop();
                })
                .done(function (data) {
                    map.updateLotAddWindowSuccess(data);
                })
                .fail(function() {
                    map.updateLotAddWindowFailure();
                });
        }
    },

    updateLotAddWindow: function () {
        var drawnLots = this._drawnLots.getLayers().length > 0,
            parcels = this.selectedParcels;
        this.replaceLotAddWindowContent(templates['window.hbs']({
            canSubmit: drawnLots || (parcels.length > 0),
            drawnLots: drawnLots,
            parcels: parcels
        }));
    },

    updateLotAddWindowSuccess: function (pk) {
        var map = this;
        this.replaceLotAddWindowContent(templates['success.hbs']({
            pk: pk
        }));

        $('.add-lot-mode-view')
            .attr('href', Django.url('lots:lot_detail', { pk: pk }));
        $('.add-lot-mode-edit')
            .attr('href', Django.url('admin:lots_lot_change', pk));
        $(cancelButtonSelector).click(function () {
            map.exitLotAddMode();
        });
    },

    updateLotAddWindowFailure: function () {
        var map = this;
        this.replaceLotAddWindowContent(templates['failure.hbs']({}));

        $(cancelButtonSelector).click(function () {
            map.exitLotAddMode();
        });
    },

    exitLotAddMode: function () {
        $(this.options.addLotParent).removeClass('on');
        this.fire('exitmode', { name: 'addlot' });
        $('.map-add-lot-mode-container').hide();
        this.off('zoomend', this.lotAddZoomHandler);
        this.removeParcelsLayer();
        this.removeDrawControl();
    }

});


// Add events to map
L.Map.addInitHook(function () {
    this.on('draw:created', function (e) {
        this._drawnLots.addLayer(e.layer);
        this.updateLotAddWindow();
    }, this);

    this.on('zoomend', this.lotAddZoomHandler);

    this.on('entermode', function (data) {
        if (data.name !== 'addlot') {
            map.exitLotAddMode();
        }
    });

    var map = this;
    $('body').on('click', cancelButtonSelector, function (e) {
        map.selectedParcels = [];
        map.exitLotAddMode();
        e.stopPropagation();
        return false;
    });

    $('body').on('click', drawButtonSelector, function (e) {
        map.enterDrawLotMode();
        e.stopPropagation();
        return false;
    });

    $('body').on('click', submitButtonSelector, function (e) {
        map.submitLotAdd();
        e.stopPropagation();
        return false;
    });
});
