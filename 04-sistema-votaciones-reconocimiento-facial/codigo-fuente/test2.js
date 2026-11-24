(async () => {
    try {
        let r1 = await fetch('https://chevez-votaciones-1.onrender.com/api/get_users.php');
        console.log('users:', await r1.text());
        let r2 = await fetch('https://chevez-votaciones-1.onrender.com/api/manage_elections.php?action=get');
        console.log('elections:', await r2.text());
        let r3 = await fetch('https://chevez-votaciones-1.onrender.com/api/get_results.php?id_eleccion=1');
        console.log('results:', await r3.text());
    } catch(e) { console.error(e); }
})();
