class Stations {

    constructor() {
        this.contractName = 'Lyon';
        this.JCdecauxKey = '0f52b5c9394fb6fa2b4d33a60eb232b432235b73';
    }

    /**
     * Get all stations
     * @return {Promise<array>}
     */
    getAllStations() {
        let self = this;
        return new Promise(resolve => {
            $.get('https://api.jcdecaux.com/vls/v1/stations', {
                contract: self.contractName,
                apiKey: self.JCdecauxKey
            }).done(function (data) {
                resolve(data);
            });
        });
    }
}