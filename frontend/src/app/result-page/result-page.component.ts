import { Component, Input, OnInit } from '@angular/core';
import { ResultType } from '../utils/ResultType';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-result-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './result-page.component.html',
    styleUrl: './result-page.component.css'
})
export class ResultPageComponent implements OnInit {

    result: ResultType | null = ResultType.CHECK_OK;
    ResultType = ResultType;
    
    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.queryParamMap.subscribe(params => {
            const resultNumber = Number(params.get('result'));
            if (!isNaN(resultNumber) && resultNumber in ResultType) {
                this.result = resultNumber as ResultType;
            } else { this.result = null; }
        });
    }
}
