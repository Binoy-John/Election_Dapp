
export function get_index_in_list(voters_list,verify_voter){
    var pos=-1;
    for(let i=0;i<voters_list.length;i++)
    {
        if(verify_voter==voters_list[i])
        {
            pos=i;
            break;
        }
    }
    return pos;
} //looks for the id in voter list and returns an index

export function generate_proof_list_index(l,index){
    // // console.log("entered generate_proof_list_index function, l is "+l);
    var first_no = 0;
    var second_no = 1;
    var offset = 2;
    var columns = Math.ceil((Math.log2(l))); // ceil of log of l with base 2
    // // console.log("columns value is "+(columns));
    var PL=[];
    var first_claw;
    var last_claw;
    var rows;
    var flag;
    var mid;
    for (let i=0;i<l;i++)
    {
        PL.push([]);
    } //this creates an array of empty arrays

    // PL[0].push(1);
    // PL[0].push(2);
    // // console.log(PL);
    
    for(let i=0;i<columns;i++){
        first_claw = 0
        last_claw = (offset) - 1
        rows = 0
        flag = 0
        while(true){
            mid = Math.ceil((last_claw + first_claw) / 2);
            while(first_claw < mid){
                PL[first_claw].push(second_no);
                first_claw += 1
                rows += 1
            }
            while(mid <= last_claw && mid < l){
                PL[mid].push(first_no);
                mid += 1;
                rows += 1;
            }
            first_no += 2
            second_no += 2
            first_claw = last_claw + 1
            last_claw += offset

            if (last_claw >= l){
                break;
            }


        }
        while(rows<l){
            PL[rows].push(first_no);
            flag = 1;
            rows += 1;

        }
        if(flag==1){
            first_no += 1;
            second_no += 1;
        }
        offset *= 2;
    }
    
    // var newArr = [];
    // while(PL.length) newArr.push(PL.splice(0,columns));
    // // // console.log("newArr value is "+newArr);
    // // console.log(PL);
    return PL[index];

} //returns a 2d array of indices of the merkle tree to generate a proof list. this is a proof list index

export function generate_merkle_list(voters_list){
    //voter list is passed as is, without hashing it before calling
    var offset = 0;
    var voters_length = voters_list.length;
    var merkle_list = [];
    var last;
    var hashed_voter
    for(let i=0;i<voters_length;i++)
    {
        hashed_voter = web3.utils.soliditySha3({t: 'address', v: voters_list[i]});
        merkle_list.push(Web3.utils.toHex(hashed_voter));
    }
    // // // console.log(merkle_list);
    // // // console.log("Added the initial list of voters into the merkle list");
    while(voters_length>0){
        // // console.log("creating a new level");
        for(let i=0;i<voters_length-1;i+=2)
        {
            last = voters_length + offset;
            // // // console.log("Hashing index "+(offset+i)+" and "+(offset+i+1));
            // const hash = web3.utils.soliditySha3({t: 'address', v: s1});
            merkle_list.push(Web3.utils.toHex( Web3.utils.soliditySha3({t:"bytes32",v: merkle_list[offset + i]}, {t:"bytes32", v: merkle_list[offset + i+1]}) ));
        }
        // // // console.log("Added new element in current level");

        if (voters_length % 2 != 0 && voters_length != 1){
            // // // console.log("hashing "+(last-1)+" and "+(last-1)+" ");
            merkle_list.push(Web3.utils.toHex( Web3.utils.soliditySha3({t:"bytes32",v: merkle_list[last-1]}, {t:"bytes32", v: merkle_list[last-1]}) ));
        }
        offset += voters_length;
        // // console.log("offset value updated to "+ offset);
        if (voters_length % 2 != 0 && voters_length != 1){
            voters_length = Math.ceil((voters_length) / 2);
        }
        else{
            voters_length = parseInt(voters_length / 2);
        }
        // // console.log("voters length updated to "+ voters_length);
    }
    return merkle_list;
} 

export function generate_proof_list(proof_list_index , merkle_list){
    // call this function using a row in the generate_proof_list_index function
    var proof_list = [];
    
    for(let i=0;i<proof_list_index.length;i++)
    {
        // // // console.log("pushing "+merkle_list[proof_list_index[i]])
        proof_list.push(merkle_list[proof_list_index[i]]);
    }
    return proof_list;

}
