function wx(container, args){
    if (args.length > 0) {
        const station = args[0];
        const hrs = args[1];
        container.innerHTML = `Weather at airport ${station} for the previous ${hrs} hours`;
    } else {
        container.innerHTML = 'Please specify station';
    }
}