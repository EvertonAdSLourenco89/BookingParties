import { saveAs } from 'file-saver';

const fileService = {

    //adiciona log
    appendToFile: (log, fileName) => {

        let logs = localStorage.getItem(fileName) || '';
        logs += log + '\n';
        localStorage.setItem(fileName, logs);
    },
    // Salva arquivo de log
    saveFile: (fileName) => {
        const logs = localStorage.getItem(fileName) || '';
        const blob = new Blob([logs], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, fileName);
    },
    // Processa os logs e retornar um array de objetos
    getAccessLogs(fileName){
        const logs = localStorage.getItem(fileName) || '';
        return logs.trim().split('\n').map(log => {
            const [date, userType, username, action] = log.match(/\[(.*?)\] - (.*?) - (.*?) - (.*?)$/).slice(1);
            return { date, userType, username, action };
        });
    }



};

export default fileService;